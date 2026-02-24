import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // very important for security
    },

    age: {
      type: Number,
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },

    height: {
      type: Number, // cm
      required: true
    },

    weight: {
      type: Number, // kg
      required: true
    },

    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "heavy"],
      required: true
    },

    goal: {
      type: String,
      enum: ["fat_loss", "maintenance", "muscle_gain"],
      required: true
    },

    dietType: {
      type: String,
      enum: ["veg", "eggetarian", "non_veg", "vegan", "jain"],
      required: true
    },

    allergies: {
      type: [String],
      enum: ["nuts", "lactose"],
      default: []
    },

    dailyCalorieLimit: {
      type: Number,
      required: true
    },

    waterGoal: {
      type: Number, // ml
      default: function () {
        return Math.round(this.weight * 35);
      }
    },

    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActiveDate: {
        type: Date
      }
    }
  },
  { timestamps: true }
);

/* Hash password before save */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* Compare password method */
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
