import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import { escapeRegex } from "../utils/helpers/appHelpers.js";
import User from "../models/User.js";

/*  
    Route: POST api/admin/coupon
    Purpose: Create new coupon
*/
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expiryDate, minAmount, maxAmount } = req.body;

  const regTerm = escapeRegex(code.trim());
  const couponExist = await Coupon.findOne({
    code: { $regex: regTerm, $options: "i" },
  });
  if (couponExist) {
    return handleErrorResponse(res, 401, "Coupon already exists");
  }

  const coupon = new Coupon({
    code,
    discount,
    expiryDate,
    minAmount,
    maxAmount,
  });

  await coupon.save();
  res.status(201).json(coupon);
});

/*  
    Route: PUT api/admin/coupon/:id
    Purpose: Edit existing coupon
*/
export const editCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { code, discount, expiryDate, minAmount, maxAmount } = req.body;

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return handleErrorResponse(res, 404, "Coupon not found");
  }

  const regTerm = escapeRegex(code.trim());
  const couponExist = await Coupon.findOne({
    _id: { $ne: id },
    code: { $regex: `^${regTerm}$`, $options: "i" },
  });

  if (couponExist) {
    return handleErrorResponse(res, 401, "Coupon code already exists");
  }

  coupon.code = code || coupon.code;
  coupon.discount = discount || coupon.discount;
  coupon.expiryDate = expiryDate || coupon.expiryDate;
  coupon.minAmount = minAmount || coupon.minAmount;
  coupon.maxAmount = maxAmount || coupon.maxAmount;

  await coupon.save();
  res.status(200).json(coupon);
});

/*  
    Route: GET api/admin/coupons
    Purpose: List coupons for users
*/
export const listAdminCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, filter } = req.query;

  const myCustomLabels = {
    totalDocs: "totalCoupons",
    docs: "coupons",
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: myCustomLabels,
    sort: {
      createdAt: -1
    }
  };

  const query = {};

  if (filter === "inactive") {
    query.isActive = false;
  }

  if (search) {
    const regTerm = escapeRegex(search.trim());
    query.code = { $regex: regTerm, $options: "i" };
  }
  const coupons = await Coupon.paginate(query, options);
  res.json({...coupons});
});

/*  
    Route: DELETE api/admin/coupon/:id
    Purpose: Soft delete a coupon
*/
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return handleErrorResponse(res, 404, "Coupon not found");
  }
  await coupon.softDelete();
  return res.json(coupon);
});

/*  
      Route: PUT|PATCH api/admin/coupon/restore/:id
      Purpose: Restore a soft-deleted coupon
  */
export const restoreCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return handleErrorResponse(res, 404, "Coupon not found", {});
  }
  await coupon.restore();
  return res.json(coupon);
});

/*  
    Route: GET api/user/coupon/list
    Purpose: List coupons for users
*/
export const listUserCoupons = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const user = await User.findById(req.user._id);

  const coupons = await Coupon.find({
    expiryDate: { $gte: currentDate },
    isActive: true,
    _id: { $nin: user.usedCoupons },
  });

  res.json(coupons);
});
/*  
    Route: POST api/user/coupon/verify
    Purpose: Create new coupon
*/
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;

  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    return handleErrorResponse(res, 404, "Coupon not found or expired", {});
  }

  const user = await User.findById(req.user._id);

  if(user && user.usedCoupons.includes(coupon._id)){
    return handleErrorResponse(res, 400, "Coupon already used", {});
  }

  const { valid, message } = coupon.validateCoupon(cartTotal);

  if (!valid) {
    return handleErrorResponse(res, 400, message, {});
  }

  return res.json(coupon);
});
