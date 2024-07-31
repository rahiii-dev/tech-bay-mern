import express from "express";
import { listUserCoupons, validateCoupon } from "../../controllers/couponController.js";

const router = express.Router();

router.get('/list', listUserCoupons);
router.post('/verify', validateCoupon);

export default router