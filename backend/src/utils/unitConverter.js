export const convertToBaseUnit = (quantity, unit, ingredient) => {
  if (ingredient.unitType === "piece" && (unit === "piece" || unit === "pc")) {
      return quantity * 100;
  }
  const conversions = {
    g: 1,
    kg: 1000,
    ml: 1,
    l: 1000,
    cup: ingredient.unitType === "liquid" ? 240 : 120,
    tbsp: ingredient.unitType === "liquid" ? 15 : 10,
    piece: 100,
    pc: 100
  };

  const safeUnit = unit && conversions[unit] ? unit : ingredient.baseUnit;
  return quantity * conversions[safeUnit];
};
