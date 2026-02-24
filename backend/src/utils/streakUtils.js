import User from "../models/User.js";

export const updateStreak = async (userId) => {
  const user = await User.findById(userId);

  if (!user) return;

  // 🔥 Ensure streak object exists
  if (!user.streak) {
    user.streak = {
      current: 0,
      longest: 0,
      lastActiveDate: null
    };
  }

  const today = new Date().toDateString();
  const lastActive = user.streak.lastActiveDate
    ? user.streak.lastActiveDate.toDateString()
    : null;

  if (lastActive === today) {
    // already updated today
    return;
  }

  if (
    lastActive &&
    new Date(today) - new Date(lastActive) === 86400000
  ) {
    user.streak.current += 1;
  } else {
    user.streak.current = 1;
  }

  user.streak.longest = Math.max(
    user.streak.longest,
    user.streak.current
  );

  user.streak.lastActiveDate = new Date();

  await user.save();
};
