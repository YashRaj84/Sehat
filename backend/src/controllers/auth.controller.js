import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { calculateDailyCalories } from "../utils/calorieCalculator.js";

/**
 * REGISTER USER
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    age,
    gender,
    height,
    weight,
    activityLevel,
    goal,
    dietType,
    allergies
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const dailyCalorieLimit = calculateDailyCalories({
    age,
    gender,
    height,
    weight,
    activityLevel,
    goal
  });

  const user = await User.create({
    name,
    email,
    password,
    age,
    gender,
    height,
    weight,
    activityLevel,
    goal,
    dietType,
    allergies,
    dailyCalorieLimit
  });

  const token = generateToken(user._id);

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      dailyCalorieLimit: user.dailyCalorieLimit
    }
  });
};

/**
 * LOGIN USER
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      dailyCalorieLimit: user.dailyCalorieLimit
    }
  });
};
