import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import customerRoutes from "./Admin/customerRoutes.js"
import categoryRoutes from './Admin/categoryRoutes.js';
import brandRoutes from './Admin/brandRoutes.js'
import productRoutes from './Admin/productRoutes.js'
import orderRoutes from './Admin/orderRoutes.js';
import couponRoutes from './Admin/couponRoutes.js';
import salesRoutes from './Admin/salesRouter.js';
import productOfferRoutes from './Admin/ProductOfferRoutes.js';
import { getDashboardDetails } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.use(customerRoutes)
router.use(categoryRoutes)
router.use(brandRoutes)
router.use(productRoutes)
router.use(orderRoutes)
router.use(couponRoutes)
router.use(salesRoutes)
router.use(productOfferRoutes)

router.get('/dashboard-details', getDashboardDetails)

export default router;
