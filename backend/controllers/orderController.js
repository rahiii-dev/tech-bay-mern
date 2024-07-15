import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import { cartPopulateOptions, formatCart } from "./cartController.js";
import Order from "../models/Order.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";

/*  
    Route: POST api/admin/order
    Purpose: Create new order
*/
export const createOrder = asyncHandler(async (req, res) => {
  const { cartId, addressId, paymentMethod } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ _id: cartId, user: userId }).populate(cartPopulateOptions);

  if (!cart) {
    return handleErrorResponse(res, 404, "Cart not forund");
  }

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    return handleErrorResponse(res, 404, "Address not found");
  }

  const formattedCart = formatCart(cart, req.user);

  const orderedItems = cart.items.map((item) => {
    return {
      name: item.product.name,
      price: item.product.price,
      images: item.product.imageUrls,
      thumbnail: item.product.thumbnailUrl,
      category: item.product.brand.category,
      brand: item.product.brand.name,
      quantity: item.quantity,
    };
  });

  const orderedAddres = {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
  }

  const order = new Order({
    user: userId,
    orderedItems,
    orderedAmount: {
      subtotal: formattedCart.cartTotal.subtotal,
      deliveryFee: formattedCart.orderTotal.deliveryFee,
      discount: formattedCart.cartTotal.discount,
      total: formattedCart.orderTotal.total,
    },
    address: orderedAddres,
    paymentMethod,
  });

  const createdOrder = await order.save();
  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json(createdOrder);
});
