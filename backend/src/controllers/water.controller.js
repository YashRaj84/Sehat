import DailyLog from "../models/DailyLog.js";
import User from "../models/User.js";
import { updateStreak } from "../utils/streakUtils.js";

const today = () => new Date().toISOString().split("T")[0];

/**
 * POST /api/water/add
 */
export const addWater = async (req, res) => {
  try {
    const { amount } = req.body; // ml

    let log = await DailyLog.findOne({
      user: req.user._id,
      date: today()
    });

    if (!log) {
      log = await DailyLog.create({
        user: req.user._id,
        date: today(),
        meals: { breakfast: [], lunch: [], snacks: [], dinner: [] }
      });
    }

    log.waterConsumed += amount;
    await log.save();

    const user = await User.findById(req.user._id);
    updateStreak(user);
    await user.save();

    res.json({
      waterConsumed: log.waterConsumed,
      waterGoal: user.waterGoal,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
