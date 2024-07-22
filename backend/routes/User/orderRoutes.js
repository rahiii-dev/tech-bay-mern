import express from "express";
import { cancelOrder, createOrder, getUserOrders, returnOrder } from "../../controllers/orderController.js";

const router = express.Router();

router.post('/', createOrder);
router.get('/list', getUserOrders);
router.post('/:orderId/cancel', cancelOrder);
router.post('/:orderId/return', returnOrder);

export default router
