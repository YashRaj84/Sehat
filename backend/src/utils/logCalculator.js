export const calculateMealValues = (ingredient, quantity) => {
  const factor = quantity / 100;

  return {
    calories: +(ingredient.caloriesPer100g * factor).toFixed(2),
    protein: +(ingredient.protein * factor).toFixed(2),
    carbs: +(ingredient.carbs * factor).toFixed(2),
    fats: +(ingredient.fats * factor).toFixed(2)
  };
};
