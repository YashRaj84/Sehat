import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "millets",
        "grains",
        "legumes",
        "dairy",
        "vegetables",
        "fruits",
        "nuts_seeds",
        "oils_fats",
        "meat",
        "eggs",
        "processed",
        "other"
      ],
      required: true
    },

    caloriesPer100g: {type: Number, required: true},
    protein: {type: Number, required: true},
    carbs: {type: Number, required: true},
    fats: {type: Number, required: true},

    unitType: {
      type: String,
      enum: ["gram", "tbsp", "piece", "solid", "liquid"],
      default: "gram",
      required: true
    },

    baseUnit: {
      type: String,
      enum: ["g", "ml"],
      required: true
    },

    tags: {
      isVeg: { type: Boolean, default: true },
      isEgg: { type: Boolean, default: false },
      isVegan: { type: Boolean, default: false },
      isJain: { type: Boolean, default: true }
    },

    allergens: {
      type: [String],
      enum: ["nuts", "lactose"],
      default: []
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // null = Global Item (Visible to everyone)
    }
  },
  { timestamps: true }
);

export default mongoose.model("Ingredient", ingredientSchema);
