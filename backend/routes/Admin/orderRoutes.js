import express from "express";
import { getAdminOrders, getOrderDetail, updateOrderDetail } from "../../controllers/orderController.js";

const router = express.Router();

router.get('/orders', getAdminOrders);
router.get('/order/:orderId', getOrderDetail);
router.put('/order/:orderId', updateOrderDetail);

export default router
