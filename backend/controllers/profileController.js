import asyncHandler from "express-async-handler";
import Address from "../models/Address.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";

/*  
    Route: POST api/user/profile/addresses
    Purpose: Add a new address for the user
    Access: Private
*/
export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

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
    isDefault
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
    Route: PUT api/user/profile/addresses/:id
    Purpose: Update an existing address for the user
    Access: Private
*/
export const updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { street, city, state, zipCode, country } = req.body;
  
    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { street, city, state, zipCode, country },
      { new: true }
    );
  
    if (!address) {
      return handleErrorResponse(res, 404, "Address not found");
    }
  
    return res.json(address);
  });
  