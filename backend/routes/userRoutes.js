import express from "express";
import { userCategories, userHome, userProducts, userProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/home', userHome);
router.get('/products', userProducts);
router.get('/categories', userCategories);

// protected
router.get('/profile', isAuthenticated, userProfile)

export default router