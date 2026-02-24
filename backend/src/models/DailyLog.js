import mongoose from "mongoose";

const mealItemSchema = new mongoose.Schema(
  {
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true
    },
    quantity: {type: Number, required: true},
    unit: {type: String, required: true},
    normalizedQuantity: {
      type: Number,
      required: true
    },
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }

);

const dailyLogSchema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: String, required: true},

    foodItems: [{
      ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
      quantity: Number,
      unit: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fats: Number,
      
      // 🔥 The Magic Field
      loggedAt: { type: Date, default: Date.now }, 
      
      // Optional: Keep a label just in case user wants to tag it manually later
      label: { type: String, default: "General" } 
    }],

    totalCalories: {
      type: Number,
      default: 0
    },

    totalProtein: {
      type: Number,
      default: 0
    },

    totalCarbs: {
      type: Number,
      default: 0
    },

    totalFats: {
      type: Number,
      default: 0
    },

    waterConsumed: {
      type: Number,
      default: 0 // ml
    },

    suggestions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

/* Ensure one log per user per day */
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyLog", dailyLogSchema);
