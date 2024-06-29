import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const customerList = asyncHandler(async (req, res) => {
  /*  
        Route: GET api/admin/customer/list
        Purpose: List customer for admin
    */
  const customers = await User.find({ _id: { $ne: req.user?._id } }).select(
    "-password"
  );
  return res.json({
    totalCustomerCount: customers.length,
    customers: customers,
  });
});

export const customerBlock = asyncHandler(async (req, res) => {
  /*  
        Route: GET api/admin/customer/:id/block
        Purpose: Block a customer
    */
  const customer = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true },
    { new: true }
  ).select("-password");
  return res.json(customer);
});

export const customerUnblock = asyncHandler(async (req, res) => {
  /*  
        Route: GET api/admin/customer/:id/block
        Purpose: Block a customer
    */
  const customer = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true }
  ).select("-password");
  return res.json(customer);
});
