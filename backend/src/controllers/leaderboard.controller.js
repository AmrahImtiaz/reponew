import User from "../models/user.model.js";

// 1) Get Top 3 users
export const getTopThreeUsers = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(3);

    res.json({
      success: true,
      users: topUsers
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 2) Get Full Rankings
export const getFullLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ points: -1 });

    res.json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 3) Get General Stats
export const getGeneralStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const allUsers = await User.find();

    const totalAnswers = allUsers.reduce((sum, u) => sum + u.answers, 0);
    const avgRating =
      allUsers.reduce((sum, u) => sum + (u.rating || 0), 0) /
      (totalUsers || 1);

    res.json({
      success: true,
      totalUsers,
      totalAnswers,
      avgRating: Number(avgRating.toFixed(1))
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
