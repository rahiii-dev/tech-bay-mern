import express from "express";
import { confirmReturn, getAdminOrders, getOrderDetail, returnOrdersList, updateOrderDetail } from "../../controllers/orderController.js";

const router = express.Router();

router.get('/orders', getAdminOrders);
router.get('/order/returns', returnOrdersList);
router.post('/order/confirm-return', confirmReturn);
router.get('/order/:orderId', getOrderDetail);
router.put('/order/:orderId', updateOrderDetail);

export default router
