import express from "express";
import { getAdminOrders, getOrderDetail } from "../../controllers/orderController.js";

const router = express.Router();

router.get('/orders', getAdminOrders);
router.get('/order/:orderId', getOrderDetail);

export default router
