import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { escapeRegex } from "../utils/helpers/appHelpers.js";

export const customerList = asyncHandler(async (req, res) => {
  /*  
        Route: GET api/admin/customer/list
        Purpose: List customer for admin
    */

  const { page = 1, limit = 10, filter, search } = req.query;
  const filterQuery = {
    _id: { $ne: req.user?._id },
    isAdmin: false,
  };

  const myCustomLabels = {
    totalDocs: "totalCustomers",
    docs: "customers",
  };

  if(filter){
    if(filter === 'notverified'){
      filterQuery.isVerified = false;
    }
    else if(filter === 'blocked'){
      filterQuery.isBlocked = true;
    }
  }

  if (search) {
    const regTerm = escapeRegex(search.trim());
    filterQuery.$or = [
      {fullName: { $regex: regTerm, $options: "i" }},
      {email: { $regex: regTerm, $options: "i" }},
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: myCustomLabels,
    select: '-password',
    sort: { createdAt: -1 },
  };

  const customers = await User.paginate(filterQuery, options)

  return res.json(customers);
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
