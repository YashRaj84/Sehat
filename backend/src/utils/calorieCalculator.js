export const calculateDailyCalories = ({
  age,
  gender,
  height,
  weight,
  activityLevel,
  goal
}) => {
  let bmr;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMap = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725
  };

  let tdee = bmr * activityMap[activityLevel];

  if (goal === "fat_loss") return Math.round(tdee - 500);
  if (goal === "muscle_gain") return Math.round(tdee + 400);

  return Math.round(tdee);
};
