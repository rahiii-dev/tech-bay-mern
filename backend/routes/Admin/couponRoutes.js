import express from "express";
import validatorMiddleware from '../../middleware/validatorMiddleware.js';
import { createCoupon, deleteCoupon, editCoupon, listAdminCoupons, restoreCoupon } from "../../controllers/couponController.js";
import { validateCouponData } from "../../utils/validators/couponValidators.js";

const router = express.Router();

router.get('/coupons', listAdminCoupons);

router.post('/coupon', validateCouponData, validatorMiddleware, createCoupon);
router.put('/coupon/:id', validateCouponData, validatorMiddleware, editCoupon);
router.delete('/coupon/:id', deleteCoupon);
router.put('/coupon/restore/:id', restoreCoupon);

export default router