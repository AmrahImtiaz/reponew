import express from "express";
import {
  getTopThreeUsers,
  getFullLeaderboard,
  getGeneralStats
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/top", getTopThreeUsers);
router.get("/all", getFullLeaderboard);
router.get("/stats", getGeneralStats);

export default router;
