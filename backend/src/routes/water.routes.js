import express from "express";
import { addWater } from "../controllers/water.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addWater);

export default router;
