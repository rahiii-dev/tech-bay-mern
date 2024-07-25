import express from "express";
import { getUserWallet, getUserWalletHistory } from "../../controllers/WalletController.js";

const router = express.Router();

router.get('/', getUserWallet);
router.get('/history', getUserWalletHistory);

export default router;
