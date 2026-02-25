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

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dietType: user.dietType,
      dailyCalorieLimit: user.dailyCalorieLimit
    }
  });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the fields from the frontend
    user.name = req.body.name || user.name;
    user.age = req.body.age || user.age;
    user.height = req.body.height || user.height;
    user.weight = req.body.weight || user.weight;
    user.goal = req.body.goal || user.goal;
    user.activityLevel = req.body.activityLevel || user.activityLevel;
    user.dietType = req.body.dietType || user.dietType;

    // Recalculate calories based on the newly updated metrics!
    user.dailyCalorieLimit = calculateDailyCalories({
      age: user.age,
      gender: user.gender, // Assuming gender doesn't change from frontend yet
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      goal: user.goal
    });

    const updatedUser = await user.save();

    // Send back the shiny new data to update local storage
    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        height: updatedUser.height,
        weight: updatedUser.weight,
        goal: updatedUser.goal,
        activityLevel: updatedUser.activityLevel,
        dietType: updatedUser.dietType,
        dailyCalorieLimit: updatedUser.dailyCalorieLimit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
