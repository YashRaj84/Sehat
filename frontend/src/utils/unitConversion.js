export const convertToGramOrMl = (quantity, unit, baseUnit) => {
  // Simple conversion factors
  const factors = {
    g: 1,
    ml: 1,
    kg: 1000,
    l: 1000,
    // Average estimations
    cup: 240, 
    tbsp: 15,
    tsp: 5,
    piece: 1 // pieces are handled specifically by weight usually, but 1:1 for now
  };

  const factor = factors[unit] || 1;
  return quantity * factor;
};

export const calculateItemMacros = (item, quantity, unit) => {
  // If item is per piece, and user selected piece
  if (item.unitType === "piece" && (unit === "piece" || unit === "pc")) {
      const ratio = quantity; // 1 cookie = 1 * calories
      return {
          calories: item.caloriesPer100g * ratio,
          protein: item.protein * ratio,
          carbs: item.carbs * ratio,
          fats: item.fats * ratio
      };
  }

  // Standard Weight/Volume Calculation
  // We assume item.caloriesPer100g is strictly per 100 base units (g or ml)
  const amountInBase = convertToGramOrMl(quantity, unit, item.baseUnit);
  const ratio = amountInBase / 100;

  return {
      calories: item.caloriesPer100g * ratio,
      protein: item.protein * ratio,
      carbs: item.carbs * ratio,
      fats: item.fats * ratio
  };
};