import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";

/*  
    Route: GET api/user/cart
    Purpose: get user cart
*/
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  
  return res.json(cart);
});

/*  
    Route: POST api/user/cart
    Purpose: add items to user cart
*/
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return handleErrorResponse(res, 404, "Product not found", {
      title: "Invalid Product",
      description: "Add a valid product to cart",
    });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const cartItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.status(201).json(cart);
});

/*  
    Route: DELETE api/user/cart/:itemId
    Purpose: add items to user cart
*/
export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();
    return res.json(cart);
  }

  return handleErrorResponse(res, 404, "Cart not found", {
    title: "Invalid Cart",
    description: "This cart is not available",
  });
});
