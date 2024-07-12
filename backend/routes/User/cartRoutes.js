import express from "express";
import { addItemToCart, getCart, removeItemFromCart, updateCartItemQuantity } from "../../controllers/cartController.js";

const router = express.Router();

router.get('/', getCart);
router.post('/', addItemToCart);
router.put('/:itemId', updateCartItemQuantity)
router.delete('/:itemId', removeItemFromCart)

export default router
