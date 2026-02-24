import express from "express";
import { 
  getTodayLog, 
  addFoodItem,      // Changed from addMealItem
  updateFoodItem,   // Changed from updateMealItem
  removeFoodItem,   // Changed from removeMealItem
  updateWater,
  getTodayCategoryStats,
  getHistoryLogs
} from "../controllers/log.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/today", protect, getTodayLog);
router.get("/history", protect, getHistoryLogs);

router.post("/add-item", protect, addFoodItem); 

router.put("/update-item", protect, updateFoodItem); 

router.post("/remove-item", protect, removeFoodItem);

router.patch("/water", protect, updateWater);

router.get("/stats", protect, getTodayCategoryStats);

export default router;