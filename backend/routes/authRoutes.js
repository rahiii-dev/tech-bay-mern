import express from "express";
import { authenticateUser, createUser, googleAuth, logoutUser } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/google', googleAuth)

router.post('/login', authenticateUser)
      .post('/register', createUser)
      .post('/logout', isAuthenticated, logoutUser)

export default router