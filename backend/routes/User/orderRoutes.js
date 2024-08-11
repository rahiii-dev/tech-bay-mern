import express from "express";
import { cancelOrder, createOrder, captureOrder, getUserOrders, returnOrder, downloadOrderInvoice } from "../../controllers/orderController.js";

const router = express.Router();

router.post('/', createOrder);
router.post('/capture', captureOrder);

router.get('/list', getUserOrders);

router.post('/:orderId/cancel', cancelOrder);
router.post('/:orderId/return', returnOrder);

router.get('/invoice-download', downloadOrderInvoice);

export default router
