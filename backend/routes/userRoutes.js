import express from "express";
import { userBrands, userCategories, userGetProductDetail, userHome, userProducts } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import cartRoutes from './User/cartRoutes.js';
import wishlistRoutes from './User/wishlistRoutes.js';
import profileRoutes from './User/profileRoutes.js'
import orderRoutes from './User/orderRoutes.js'
import walletRoutes from './User/walletRoutes.js'
import { wishListToCart } from "../controllers/cartController.js";
import couponRoutes from './User/couponRoutes.js'

const router = express.Router();

router.get('/home', userHome);
router.get('/products', userProducts);
router.get('/product/:id', userGetProductDetail);
router.get('/categories', userCategories);
router.get('/brands', userBrands);

// protected
router.use('/cart', isAuthenticated, cartRoutes);
router.use('/wishlist', isAuthenticated, wishlistRoutes);
router.use('/wish-to-cart', isAuthenticated, wishListToCart);
router.use('/profile', isAuthenticated, profileRoutes);
router.use('/order', isAuthenticated, orderRoutes);
router.use('/wallet', isAuthenticated, walletRoutes);
router.use('/coupon', isAuthenticated, couponRoutes);

export default router