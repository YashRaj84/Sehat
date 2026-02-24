import DailyLog from "../models/DailyLog.js";
import Ingredient from "../models/Ingredient.js";
import { calculateMealValues } from "../utils/logCalculator.js";
import { generateSuggestions } from "../utils/suggestionEngine.js";
import { updateStreak } from "../utils/streakUtils.js";
import { convertToBaseUnit } from "../utils/unitConverter.js";
import { calculateCategoryTotals } from "../utils/categoryAnalytics.js";
import User from "../models/User.js";

/* Helper: get today's date YYYY-MM-DD */
const today = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/* Helper: Recalculate totals from the flat foodItems array */
const recalcTotals = (log) => {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fats = 0;

  if (log.foodItems && log.foodItems.length > 0) {
    log.foodItems.forEach((item) => {
      calories += item.calories || 0;
      protein += item.protein || 0;
      carbs += item.carbs || 0;
      fats += item.fats || 0;
    });
  }

  log.totalCalories = calories;
  log.totalProtein = protein;
  log.totalCarbs = carbs;
  log.totalFats = fats;
};

/* =========================
   GET TODAY'S LOG
========================= */
export const getTodayLog = async (req, res) => {
  try {
    let log = await DailyLog.findOne({
      user: req.user._id,
      date: today()
    }).populate("foodItems.ingredient");

    if (!log) {
      log = await DailyLog.create({
        user: req.user._id,
        date: today(),
        foodItems: [],
        waterConsumed: 0
      });
    }

    // Sort timeline: Earliest -> Latest
    if (log.foodItems) {
      log.foodItems.sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));
    }

    return res.json(log);
  } catch (err) {
    console.error("GET LOG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADD FOOD ITEM (Timeline)
========================= */
export const addFoodItem = async (req, res) => {
  try {
    // We accept 'time' now instead of 'mealType'
    const { ingredientId, quantity, unit, time } = req.body;

    const ingredient = await Ingredient.findById(ingredientId);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    let log = await DailyLog.findOne({
      user: req.user._id,
      date: today()
    });

    if (!log) {
      log = await DailyLog.create({
        user: req.user._id,
        date: today(),
        foodItems: []
      });
    }

    const normalizedQty = convertToBaseUnit(quantity, unit, ingredient);
    const values = calculateMealValues(ingredient, normalizedQty);

    const newItem = {
      ingredient: ingredient._id,
      quantity: normalizedQty,
      unit: ingredient.baseUnit,
      calories: values.calories,
      protein: values.protein,
      carbs: values.carbs,
      fats: values.fats,
      loggedAt: time ? new Date(time) : new Date()
    };

    log.foodItems.push(newItem);
    log.foodItems.sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));

    recalcTotals(log);

    // Update suggestions & Streak
    // Note: If generateSuggestions crashes, comment it out until step 2 below is fixed
    const user = await User.findById(req.user._id);
    if (user) {
         try { log.suggestions = generateSuggestions(log, user); } catch(e) { console.log("Suggestion skip"); }
         await updateStreak(req.user._id);
    }

    await log.save();
    
    // Return populated log
    await log.populate("foodItems.ingredient");
    res.json(log);

  } catch (err) {
    console.error("ADD ITEM ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   REMOVE FOOD ITEM
========================= */
export const removeFoodItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    let log = await DailyLog.findOne({
      user: req.user._id,
      date: today()
    });

    if (!log) return res.status(404).json({ message: "Log not found" });

    // Filter out the specific item
    log.foodItems = log.foodItems.filter(
      (item) => item._id.toString() !== itemId
    );

    recalcTotals(log);
    await log.save();
    res.json(log);
  } catch (err) {
    console.error("REMOVE ITEM ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE FOOD ITEM
========================= */
export const updateFoodItem = async (req, res) => {
  try {
    const { itemId, quantity, time } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const log = await DailyLog.findOne({ user: req.user._id, date: today() });
    if (!log) return res.status(404).json({ message: "Log not found" });

    const item = log.foodItems.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const ingredient = await Ingredient.findById(item.ingredient);
    if (!ingredient) return res.status(404).json({ message: "Ingredient missing" });

    const values = calculateMealValues(ingredient, quantity);

    item.quantity = quantity;
    item.calories = values.calories;
    item.protein = values.protein;
    item.carbs = values.carbs;
    item.fats = values.fats;
    
    if (time) {
      item.loggedAt = new Date(time);
      log.foodItems.sort((a, b) => new Date(a.loggedAt) - new Date(b.loggedAt));
    }

    recalcTotals(log);
    await log.save();
    res.json(log);
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE WATER
========================= */
export const updateWater = async (req, res) => {
  try {
    const { amount } = req.body; 

    let log = await DailyLog.findOne({ user: req.user._id, date: today() });

    if (!log) {
      log = await DailyLog.create({
        user: req.user._id,
        date: today(),
        foodItems: [],
        waterConsumed: 0
      });
    }

    log.waterConsumed = Math.max(0, (log.waterConsumed || 0) + amount);
    await log.save();
    res.json(log);
  } catch (err) {
    console.error("UPDATE WATER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET CATEGORY STATS (The missing function!)
========================= */
export const getTodayCategoryStats = async (req, res) => {
  try {
    const log = await DailyLog.findOne({
      user: req.user._id,
      date: today()
    }).populate("foodItems.ingredient");

    if (!log) return res.json({});

    const categoryStats = calculateCategoryTotals(log); 

    res.json(categoryStats);
  } catch (err) {
    console.error("CATEGORY STATS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET HISTORY LOGS (last N days)
   Returns array oldest -> newest with zero totals when missing
========================= */
export const getHistoryLogs = async (req, res) => {
  try {
    const days = Math.min(90, parseInt(req.query.days, 10) || 7); // Cap to max 90 days for performance
    const results = [];
    const now = new Date();

    // 1. Calculate the starting date string (X days ago)
    const start = new Date(now);
    start.setDate(now.getDate() - (days - 1));
    const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;

    // 2. Fetch all logs in that date range in a SINGLE query (Much faster!)
    const logs = await DailyLog.find({
      user: req.user._id,
      date: { $gte: startStr }
    });

    // 3. Create a quick lookup map (e.g., {"2026-02-19": logObject})
    const logMap = {};
    logs.forEach(log => {
        logMap[log.date] = log;
    });

    // 4. Build the continuous chronological array (xFeb -> x+1Feb -> Today)
    for (let offset = days - 1; offset >= 0; offset--) {
      const d = new Date(now);
      d.setDate(now.getDate() - offset);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // Grab the log from our map, or default to undefined if they missed that day
      const dailyLog = logMap[dateStr];

      // Push the exact data the frontend graph expects
      results.push({
        date: dateStr, // e.g., "2026-02-21"
        totalCalories: dailyLog?.totalCalories || 0,
        totalProtein: dailyLog?.totalProtein || 0,
        totalCarbs: dailyLog?.totalCarbs || 0,
        totalFats: dailyLog?.totalFats || 0,
        waterConsumed: dailyLog?.waterConsumed || 0 // Added missing water tracking!
      });
    }

    return res.json(results);
  } catch (err) {
    console.error("HISTORY LOGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};