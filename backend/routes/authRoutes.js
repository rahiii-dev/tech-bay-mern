import express from "express";
import { authenticateUser, createUser, logoutUser } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/login', authenticateUser)
      .post('/register', createUser)
      .post('/logout', isAuthenticated, logoutUser)

export default router