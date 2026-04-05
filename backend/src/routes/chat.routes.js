import express from "express";
import { generateDietAdvice } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js"; 
import rateLimit from "express-rate-limit";

const router = express.Router();

// Production Standard: Prevent API Spam
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: "You are asking questions too fast! Please wait a minute." },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// The route is protected by your auth middleware AND the rate limiter
router.post("/", protect, chatLimiter, generateDietAdvice);

export default router;