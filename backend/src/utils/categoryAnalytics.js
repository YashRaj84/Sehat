export const calculateCategoryTotals = (log) => {
  const categoryTotals = {};
  
  // 🔥 FIX: Check foodItems instead of meals
  const items = log.foodItems || [];

  items.forEach((item) => {
    // Safety check if ingredient was populated
    if (!item.ingredient) return; 

    const category = item.ingredient.category || "uncategorized";

    if (!categoryTotals[category]) {
      categoryTotals[category] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    }

    categoryTotals[category].calories += item.calories || 0;
    categoryTotals[category].protein += item.protein || 0;
    categoryTotals[category].carbs += item.carbs || 0;
    categoryTotals[category].fats += item.fats || 0;
  });

  return categoryTotals;
};