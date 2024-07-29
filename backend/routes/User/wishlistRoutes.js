import express from "express";
import { addToWishlist, getWishList, removeFromWishlist } from "../../controllers/wishListController.js";

const router = express.Router();

router.get('/', getWishList);
router.post('/', addToWishlist);
router.put('/remove', removeFromWishlist);

export default router;
