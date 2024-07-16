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
    const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;
  
    const address = await Address.findById(id);
  
    if (!address) {
      return handleErrorResponse(res, 404, "Address not found");
    }

    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }
    
    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;
    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 || address.addressLine2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    address.isDefault = isDefault || address.isDefault;

    const updatedAddress = await address.save()
  
    return res.json(updatedAddress);
  });
  