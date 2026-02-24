import express from "express";
import {
  getIngredients,
  createIngredient,
  updateIngredientCategory,
  getRecentFoods
} from "../controllers/food.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

/* Protected route */
router.get("/recents", protect, getRecentFoods);

router.get("/ingredients", protect, getIngredients);

router.post("/ingredients", protect, createIngredient);

router.patch("/ingredients/:id", protect, updateIngredientCategory);

export default router;
