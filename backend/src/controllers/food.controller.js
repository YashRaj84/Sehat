import Ingredient from "../models/Ingredient.js";
import { searchUSDAFoods } from "../services/usda.service.js";
import DailyLog from "../models/DailyLog.js";

/* =========================================
   GET RECENT FOODS
========================================= */
export const getRecentFoods = async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30)
      .populate("foodItems.ingredient");

    const allItems = [];
    const seenIds = new Set();

    logs.forEach((log) => {
      if (log.foodItems && log.foodItems.length > 0) {
        log.foodItems.forEach((item) => {
          if (item.ingredient && !seenIds.has(item.ingredient._id.toString())) {
            seenIds.add(item.ingredient._id.toString());
            allItems.push(item.ingredient);
          }
        });
      }
    });

    res.json(allItems.slice(0, 20));
  } catch (error) {
    console.error("GET RECENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   HELPER: INTELLIGENT CATEGORY MAPPING
========================================= */
const mapUsdaCategory = (usdaCategory, itemName) => {
  const cat = (usdaCategory || "").toLowerCase();
  const name = (itemName || "").toLowerCase();

  if (cat.includes("vegetable") || cat.includes("potato")) return "vegetables";
  if (cat.includes("fruit") || cat.includes("juice")) return "fruits";
  if (cat.includes("legume") || cat.includes("bean") || cat.includes("lentil") || cat.includes("peas")) return "legumes";
  if (cat.includes("grain") || cat.includes("cereal") || cat.includes("pasta") || cat.includes("bread") || cat.includes("rice") || cat.includes("bakery")) return "grains";
  if (cat.includes("nut") || cat.includes("seed")) return "nuts_seeds";
  if (cat.includes("dairy") || cat.includes("cheese") || cat.includes("milk") || cat.includes("yogurt") || cat.includes("cream")) return "dairy";
  if (cat.includes("egg") || name.includes("egg")) return "eggs";
  if (cat.includes("meat") || cat.includes("poultry") || cat.includes("pork") || cat.includes("beef") || cat.includes("chicken") || cat.includes("fish") || cat.includes("seafood") || cat.includes("sausage")) return "meat";
  if (cat.includes("fat") || cat.includes("oil") || cat.includes("butter") || cat.includes("margarine")) return "oils_fats";
  if (name.includes("millet") || name.includes("sorghum") || name.includes("bajra") || name.includes("ragi") || name.includes("jowar")) return "millets";

  return "processed";
};

/* =========================================
   CONTROLLER: GET INGREDIENTS (Search)
========================================= */
export const getIngredients = async (req, res) => {
  try {
    const { dietType, allergies } = req.user;
    const { search, category } = req.query;

    // 🔥 FIX 1: Apply strict diet/allergy filters ONLY to global foods
    let globalFoodQuery = { createdBy: null };
    
    if (dietType === "veg") globalFoodQuery["tags.isVeg"] = true;
    if (dietType === "vegan") globalFoodQuery["tags.isVegan"] = true;
    if (dietType === "jain") globalFoodQuery["tags.isJain"] = true;

    if (allergies?.length) {
      globalFoodQuery.allergens = { $nin: allergies };
    }

    // Now, search looks for strictly filtered Global Foods OR the User's Personal Foods
    let query = {
      $or: [
        globalFoodQuery,
        { createdBy: req.user._id } // 🔥 Personal custom foods bypass the filters!
      ]
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    let results = await Ingredient.find(query).sort({ name: 1 });

    // --- 2. USDA Search Integration ---
    if (search) {
      try {
        const usdaRaw = await searchUSDAFoods(search);

        const usdaNormalized = usdaRaw.map((item) => {
          const getNutrient = (id) => {
            const n = item.foodNutrients.find((x) => x.nutrientNumber === id || x.nutrientId === id);
            return n ? n.value : 0;
          };

          return {
            name: item.description.toLowerCase(),
            category: mapUsdaCategory(item.foodCategory, item.description), 
            caloriesPer100g: getNutrient("208") || getNutrient("2047") || getNutrient("1008") || 0,
            protein: getNutrient("203") || getNutrient("1003") || 0,
            carbs: getNutrient("205") || getNutrient("1005") || 0,
            fats: getNutrient("204") || getNutrient("1004") || 0,
            unitType: "gram",
            baseUnit: "g",
            _id: null, 
          };
        });

        let finalUsda = usdaNormalized;
        if (category) {
          finalUsda = usdaNormalized.filter((i) => i.category === category);
        }

        results = [...results, ...finalUsda];
      } catch (usdaError) {
        console.error("USDA Search Error:", usdaError.message);
      }
    }

    return res.json({ source: "mixed", items: results });
  } catch (error) {
    console.error("GET INGREDIENTS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* =========================================
   CONTROLLER: CREATE INGREDIENT
========================================= */
export const createIngredient = async (req, res) => {
  try {
    const { name, caloriesPer100g, protein, carbs, fats, unitType, category } = req.body;

    if (!name) return res.status(400).json({ message: "Name required" });

    const normalizedName = name.toLowerCase().trim();

    const existing = await Ingredient.findOne({ name: normalizedName, createdBy: req.user._id });
    
    if (existing) return res.json(existing);

    // 🔥 FIX 2: Added "other" to match your Ingredient.js schema exactly
    const VALID_CATEGORIES = [
      "millets", "grains", "legumes", "dairy", "vegetables",
      "fruits", "nuts_seeds", "oils_fats", "meat", "eggs", "processed", "other"
    ];
    
    const finalCategory = VALID_CATEGORIES.includes(category?.toLowerCase()) 
        ? category.toLowerCase() 
        : "other";

    const ingredient = new Ingredient({
      name: normalizedName,
      caloriesPer100g: Number(caloriesPer100g) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      unitType: unitType || "gram",
      baseUnit: "g",
      category: finalCategory,
      createdBy: req.user._id, // This is the crucial relation!
      tags: { isVeg: true },
      allergens: [],
    });

    await ingredient.save();
    return res.status(201).json(ingredient);

  } catch (error) {
    console.error("CREATE INGREDIENT ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* =========================================
   CONTROLLER: UPDATE CATEGORY
========================================= */
export const updateIngredientCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const normalizedCategory = category?.toLowerCase().trim();

    // 🔥 FIX 3: Changed findByIdAndUpdate to findOneAndUpdate to support complex queries
    const ingredient = await Ingredient.findOneAndUpdate(
      { _id: id, $or: [{ createdBy: req.user._id }, { createdBy: null }] },
      { category: normalizedCategory },
      { new: true, runValidators: true }
    );

    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });

    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};