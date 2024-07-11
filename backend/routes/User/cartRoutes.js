import express from "express";
import { addItemToCart, getCart, removeItemFromCart } from "../../controllers/cartController.js";

const router = express.Router();

router.get('/', getCart);
router.post('/', addItemToCart);
router.delete(':itemId', removeItemFromCart)

export default router
