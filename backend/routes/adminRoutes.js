import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import { customerBlock, customerList, customerUnblock } from "../controllers/customerController.js";
import categoryRoutes from './Admin/categoryRoutes.js';
import brandRoutes from './Admin/brandRoutes.js'
import productRoutes from './Admin/productRoutes.js'

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get("/customer/list", customerList);
router.put("/customer/:id/block", customerBlock);
router.put("/customer/:id/unblock", customerUnblock);

router.use(categoryRoutes)
router.use(brandRoutes)
router.use(productRoutes)

export default router;
