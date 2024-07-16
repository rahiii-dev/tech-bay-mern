import express from "express";
import { cancelOrder, createOrder, getUserOrders } from "../../controllers/orderController.js";

const router = express.Router();

router.post('/', createOrder);
router.get('/list', getUserOrders);
router.post('/:orderId/cancel', cancelOrder);

export default router
