import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";

const formatCart = (cart, user) => {
  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let discount = 0;

  const total = subtotal - discount;

  return {
    _id: cart.id,
    user: {
      fullName: user.fullName,
    },
    items: cart.items,
    cartTotal: {
      subtotal,
      discount,
      total,
    },
  };
};

const populateOptions = {
  path: "items.product",
  select: "name price brand category images thumbnail stock",
  populate: { path: "brand category", select: "name" },
};

const findUserCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate(populateOptions);
};

/*  
    Route: GET api/user/cart
    Purpose: get user cart
*/
export const getCart = asyncHandler(async (req, res) => {
   const cart = await findUserCart(req.user._id);

  if (!cart) {
    return handleErrorResponse(res, 404, "Cart not found");
  }

  const formattedCart = formatCart(cart, req.user)

  return res.json(formattedCart);
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

  // Check if sufficient stock is available
  if (product.stock < quantity) {
    return handleErrorResponse(res, 400, "Insufficient Stock", {
      title: "Insufficient Stock",
      description: "Requested quantity exceeds available stock",
    });
  }

  let cart = await findUserCart(req.user._id);
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

  product.stock -= quantity;
  await product.save();

  await cart.save();

  const updatedCart = await findUserCart(req.user._id);

  const formattedCart = formatCart(updatedCart, req.user);
  res.status(201).json(formattedCart);
});


/*  
    Route: DELETE api/user/cart/:itemId
    Purpose: add items to user cart
*/
export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    const cartItem = cart.items.find((item) => item._id.toString() === itemId);
    if (cartItem) {
      const product = await Product.findById(cartItem.product);
      if (product) {
        product.stock += cartItem.quantity;
        await product.save();
      }

      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
      await cart.save();

      const updatedCart = await findUserCart(req.user._id);
      const formattedCart = formatCart(updatedCart, req.user);
      return res.json(formattedCart);
    }
  }

  return handleErrorResponse(res, 404, "Cart not found", {
    title: "Invalid Cart",
    description: "This cart is not available",
  });
});


/*  
    Route: PUT api/user/cart/:itemId
    Purpose: update item quantity in user cart
*/
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { action } = req.body;

  if (!['increment', 'decrement'].includes(action)) {
    return handleErrorResponse(res, 400, "Invalid action", {
      title: "Invalid Action",
      description: "Action must be 'increment' or 'decrement'",
    });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return handleErrorResponse(res, 404, "Cart not found", {
      title: "Invalid Cart",
      description: "This cart is not available",
    });
  }

  const cartItem = cart.items.find((item) => item._id.toString() === itemId);
  if (!cartItem) {
    return handleErrorResponse(res, 404, "Item not found in cart", {
      title: "Invalid Item",
      description: "This item is not available in the cart",
    });
  }

  const product = await Product.findById(cartItem.product);
  if (!product) {
    return handleErrorResponse(res, 404, "Product not found", {
      title: "Invalid Product",
      description: "Product associated with this item not found",
    });
  }

  if (action === 'increment') {
    if (cartItem.quantity >= 4) {
      return handleErrorResponse(res, 400, "Maximum Quantity Exceeded", {
        title: "Maximum Quantity Exceeded",
        description: "You can only add up to 4 units of this item",
      });
    }
    if (product.stock < 1) {
      return handleErrorResponse(res, 400, "Insufficient Stock", {
        title: "Insufficient Stock",
        description: "No stock available to increment",
      });
    }
    cartItem.quantity += 1;
    product.stock -= 1;
  } else if (action === 'decrement') {
    if (cartItem.quantity === 1) {
      return handleErrorResponse(res, 400, "Quantity cannot be less than 1", {
        title: "Invalid Quantity",
        description: "Cannot decrement quantity below 1",
      });
    }
    cartItem.quantity -= 1;
    product.stock += 1;
  }

  await cart.save();
  await product.save();

  const updatedCart = await findUserCart(req.user._id);
  const formattedCart = formatCart(updatedCart, req.user);
  return res.json(formattedCart);
});


