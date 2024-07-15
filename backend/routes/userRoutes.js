import express from "express";
import { userCategories, userGetProductDetail, userHome, userProducts, userProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import cartRoutes from './User/cartRoutes.js';
import profileRoutes from './User/profileRoutes.js'
import orderRoutes from './User/orderRoutes.js'

const router = express.Router();

router.get('/home', userHome);
router.get('/products', userProducts);
router.get('/product/:id', userGetProductDetail);
router.get('/categories', userCategories);

// protected
router.use('/cart', isAuthenticated, cartRoutes)
router.use('/profile', isAuthenticated, profileRoutes)
router.use('/order', isAuthenticated, orderRoutes)

export default router