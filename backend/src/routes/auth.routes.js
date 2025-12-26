import express from "express";
import { registerUser,loginUser,logoutUser,getMe} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",authMiddleware, logoutUser);
router.get("/me", authMiddleware, getMe)

export default router;
