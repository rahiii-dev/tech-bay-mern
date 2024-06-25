import express from "express";
import { userProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/profile', isAuthenticated, userProfile)

export default router