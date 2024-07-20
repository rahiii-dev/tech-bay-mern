import asyncHandler from "express-async-handler";
import Address from "../models/Address.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import User from "../models/User.js";

/*  
    Route: GET api/user/profile/
    Purpose: Get User Profile details
    Access: Private
*/
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return handleErrorResponse(res, 404, "User not found");
  }

  return res.json(user);
});
/*  
    Route: POST api/user/profile/
    Purpose: Get User Profile details
    Access: Private
*/
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone_no } = req.body;
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return handleErrorResponse(res, 404, "User not found");
  }

  user.fullName = fullName || user.fullName;
  user.phone_no = phone_no || user.phone_no;

  await user.save();
  return res.json(user);
});
/*  
    Route: PUT api/user/profile/change-password
    Purpose: change user password
    Access: Private
*/
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return handleErrorResponse(res, 404, "User not found");
  }

  if (!oldPassword || !(await user.comparePassword(oldPassword))) {
    return handleErrorResponse(res, 401, "Invalid old password");
  }

  if (password) {
    user.password = password;
  }

  await user.save();
  return res.json({ message: "Password changed" });
});

/*  
    Route: POST api/user/profile/addresses
    Purpose: Add a new address for the user
    Access: Private
*/
export const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    addressType,
    isDefault,
  } = req.body;

  if (isDefault) {
    await Address.updateMany(
      { user: req.user._id, isDefault: true },
      { isDefault: false }
    );
  }

  const address = new Address({
    user: req.user._id,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    addressType,
    isDefault,
  });

  await address.save();

  return res.status(201).json(address);
});

/*  
    Route: GET api/user/profile/addresses
    Purpose: Get all addresses for the user
    Access: Private
*/
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  return res.json(addresses);
});

/*  
    Route: GET api/user/profile/address/:id
    Purpose: Get a address using id
    Access: Private
*/
export const getSingleAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const address = await Address.findById(id);
  return res.json(address);
});

/*  
    Route: PUT api/user/profile/address/:id
    Purpose: Update an existing address for the user
    Access: Private
*/
export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    addressType,
    isDefault,
  } = req.body;

  const address = await Address.findById(id);

  if (!address) {
    return handleErrorResponse(res, 404, "Address not found");
  }

  address.fullName = fullName || address.fullName;
  address.phone = phone || address.phone;
  address.addressLine1 = addressLine1 || address.addressLine1;
  address.addressLine2 = addressLine2 || address.addressLine2;
  address.city = city || address.city;
  address.state = state || address.state;
  address.zipCode = zipCode || address.zipCode;
  address.country = country || address.country;
  address.addressType = addressType || address.addressType;

  console.log(isDefault);
  if(isDefault === true && !address.isDefault){
    await Address.updateMany(
      { user: req.user._id, isDefault: true },
      { isDefault: false }
    );
    address.isDefault = true;
  } else if(isDefault === false){
    address.isDefault = false;
  }

  const updatedAddress = await address.save();

  return res.json(updatedAddress);
});

/*  
    Route: DELETE api/user/profile/address/:id
    Purpose: delete adddress permenantly
    Access: Private
*/
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Address.deleteOne({_id: id})
  return res.json({message: "Address deleted"})
});