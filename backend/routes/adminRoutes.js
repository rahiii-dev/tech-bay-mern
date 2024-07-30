import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import customerRoutes from "./Admin/customerRoutes.js"
import categoryRoutes from './Admin/categoryRoutes.js';
import brandRoutes from './Admin/brandRoutes.js'
import productRoutes from './Admin/productRoutes.js'
import orderRoutes from './Admin/orderRoutes.js';
import couponRoutes from './Admin/couponRoutes.js';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.use(customerRoutes)
router.use(categoryRoutes)
router.use(brandRoutes)
router.use(productRoutes)
router.use(orderRoutes)
router.use(couponRoutes)

export default router;
