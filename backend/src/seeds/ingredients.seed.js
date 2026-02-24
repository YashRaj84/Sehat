import mongoose from "mongoose";
import dotenv from "dotenv";
import Ingredient from "../models/Ingredient.js";

dotenv.config();

const ingredients = [
  // 🌾 Grains
  {
    name: "rice",
    category: "grains",
    caloriesPer100g: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    unitType: "gram",
    tags: { isVeg: true, isVegan: true, isJain: true }
  },
  {
    name: "wheat roti",
    category: "grains",
    caloriesPer100g: 297,
    protein: 9,
    carbs: 55,
    fats: 4,
    unitType: "gram",
    tags: { isVeg: true, isVegan: true, isJain: true }
  },

  // 🫘 Legumes
  {
    name: "dal",
    category: "legumes",
    caloriesPer100g: 116,
    protein: 9,
    carbs: 20,
    fats: 0.4,
    unitType: "gram",
    tags: { isVeg: true, isVegan: true, isJain: true }
  },

  // 🥛 Dairy
  {
    name: "paneer",
    category: "dairy",
    caloriesPer100g: 265,
    protein: 18,
    carbs: 1.2,
    fats: 20,
    unitType: "gram",
    tags: { isVeg: true, isVegan: false, isJain: true },
    allergens: ["lactose"]
  },
  {
    name: "curd",
    category: "dairy",
    caloriesPer100g: 98,
    protein: 11,
    carbs: 3.4,
    fats: 4.3,
    unitType: "gram",
    tags: { isVeg: true, isVegan: false, isJain: true },
    allergens: ["lactose"]
  },

  // 🥚 Eggs
  {
    name: "egg",
    category: "eggs",
    caloriesPer100g: 155,
    protein: 13,
    carbs: 1.1,
    fats: 11,
    unitType: "piece",
    tags: { isVeg: false, isEgg: true, isVegan: false, isJain: false }
  },

  // 🍗 Meat
  {
    name: "chicken breast",
    category: "meat",
    caloriesPer100g: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    unitType: "gram",
    tags: { isVeg: false, isVegan: false, isJain: false }
  },

  // 🧈 Oils & Fats
  {
    name: "oil",
    category: "oils_fats",
    caloriesPer100g: 884,
    protein: 0,
    carbs: 0,
    fats: 100,
    unitType: "tbsp",
    tags: { isVeg: true, isVegan: true, isJain: true }
  },
  {
    name: "ghee",
    category: "oils_fats",
    caloriesPer100g: 900,
    protein: 0,
    carbs: 0,
    fats: 100,
    unitType: "tbsp",
    tags: { isVeg: true, isVegan: false, isJain: true },
    allergens: ["lactose"]
  }
];

const deriveBaseUnit = (unitType) =>
  unitType === "liquid" ? "ml" : "g";

const seedIngredients = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Ingredient.deleteMany();

    const normalizedIngredients = ingredients.map((ing) => ({
      ...ing,
      baseUnit: deriveBaseUnit(ing.unitType)
    }));

    await Ingredient.insertMany(normalizedIngredients);

    console.log("✅ Ingredients seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedIngredients();
