import express from "express";
import { registerUser, loginUser, updateProfile } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Adjust this path if your middleware is named differently!

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateProfile); // The new update route!

export default router;