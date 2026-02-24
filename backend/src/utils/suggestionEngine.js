export const generateSuggestions = (log, user) => {
  const suggestions = [];

  const calorieLimit = user.dailyCalorieLimit;
  const caloriesConsumed = log.totalCalories;

  /* 🔥 Calorie-based suggestions */
  if (caloriesConsumed < 0.4 * calorieLimit) {
    suggestions.push(
      "You have consumed very few calories so far. Consider adding a balanced meal."
    );
  }

  if (caloriesConsumed > calorieLimit) {
    suggestions.push(
      "You have exceeded your daily calorie limit. Try to keep dinner lighter."
    );
  }

  const breakfastCals = breakfastItems.reduce((acc, i) => acc + i.calories, 0);
  
  if (breakfastCals < 0.1 * calorieLimit && new Date().getHours() > 11) {
    suggestions.push("Your morning intake was low. Energy levels might drop.");
  }

  /* 🥩 Protein logic (0.8–1g/kg standard) */
  const minProtein = 0.8 * user.weight;

  if (log.totalProtein < minProtein) {
    if (user.dietType === "veg") {
      suggestions.push(
        "Your protein intake is low. Add paneer, curd, dal, or soy-based foods."
      );
    } else if (user.dietType === "eggetarian") {
      suggestions.push(
        "Your protein intake is low. Eggs and dairy can help meet your protein needs."
      );
    } else if (user.dietType === "vegan") {
      suggestions.push(
        "Your protein intake is low. Consider tofu, lentils, chickpeas, or soy."
      );
    } else {
      suggestions.push(
        "Your protein intake is low. Lean meats, eggs, or dairy can help."
      );
    }
  }

  /* 💧 Water reminder */
  if (log.waterConsumed < 0.6 * user.waterGoal) {
    suggestions.push(
      "Your water intake is low today. Staying hydrated improves digestion and recovery."
    );
  }

  /* 🌙 Late-day calorie distribution (future-safe rule) */
  if (
    caloriesConsumed > 0.8 * calorieLimit &&
    log.meals.dinner.length === 0
  ) {
    suggestions.push(
      "You have already consumed most of your calories. Keep dinner light."
    );
  }

  return suggestions;
};
