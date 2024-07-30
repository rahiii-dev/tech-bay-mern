import express from "express";
import { listUserCoupons } from "../../controllers/couponController.js";

const router = express.Router();

router.get('/list', listUserCoupons);

export default router