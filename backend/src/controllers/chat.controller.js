import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";

export const generateDietAdvice = async (req, res) => {
  try {
    // 🔥 MOVE IT HERE: Initialize ONLY when the function is called
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 🔥 ADD A QUICK CHECK: Let's log it to the terminal to be 100% sure
    if (!process.env.GEMINI_API_KEY) {
        console.error("CRITICAL: API key is missing or undefined in the environment!");
        return res.status(500).json({ message: "Server configuration error." });
    }

    const { message } = req.body;
    const userId = req.user._id;

    // 1. Fetch User Profile for context
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalProtein = 45; 
    const totalCalories = 1200;

    const systemPrompt = `
      You are an expert, empathetic AI dietitian working inside the SEHAT fitness app. 
      You are talking to a user named ${user.name}.
      
      Here is their exact profile data:
      - Goal: ${user.goal.replace('_', ' ')}
      - Diet Type: ${user.dietType}
      - Activity Level: ${user.activityLevel}

      Here is their progress for today:
      - Calories Eaten: ${totalCalories} kcal
      - Protein Eaten: ${totalProtein}g

      The user is asking you a question. 
      Answer directly, give specific food recommendations based on their diet type, and keep your response under 100 words.

      User's Question: "${message}"
    `;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();

    // 5. Send it back to the frontend
    res.json({ reply: aiResponse });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "Failed to generate AI response. Please try again." });
  }
};