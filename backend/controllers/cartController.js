import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import Wishlist from "../models/Wishlist.js";

export const formatCart = (cart, user) => {
  const subtotal = cart.items.reduce((acc, item) => {
    if (item.product.stock > 0) {
      return acc + item.product.price * item.quantity;
    }
    return acc;
  }, 0);

  const discount = 0;
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
    orderTotal: {
      total
    }
  };
};

export const cartPopulateOptions = {
  path: "items.product",
  select: "name price brand category images thumbnail stock description",
  populate: { path: "brand category", select: "name" },
};

const findUserCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate(cartPopulateOptions);
};

const MAX_QUANTITY = 4

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
    (item) => item.product.id === productId
  );

  if (cartItem) {
    if (cartItem.quantity >= MAX_QUANTITY) {
      return handleErrorResponse(res, 400, "Maximum Quantity Exceeded", {
        title: "Maximum Quantity Exceeded",
        description: "You can only add up to 4 units of this item",
      });
    }

    cartItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  const updatedCart = await findUserCart(req.user._id);

  const formattedCart = formatCart(updatedCart, req.user);
  res.status(201).json(formattedCart);
});

/*  
    Route: POST api/user/wish-to-cart
    Purpose: add items from wish list to cart
*/
export const wishListToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

  if (!wishlist) {
    return handleErrorResponse(res, 404, "Wishlist not found", {
      title: "No Wishlist",
      description: "No items found in the wishlist",
    });
  }

  let cart = await findUserCart(userId);
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const addedProducts = [];

  for (const product of wishlist.products) {
    if (product.stock > 0) {
      const cartItem = cart.items.find((item) => {
        return item.product._id.toString() === product._id.toString();
      });

      if (cartItem) {
        if ((cartItem.quantity < MAX_QUANTITY)) {
          cartItem.quantity += 1;
          addedProducts.push(product._id);
        } 
      } else {
        cart.items.push({ product: product._id, quantity: 1 });
        addedProducts.push(product._id);
      }
    }
  }

  await cart.save();

  wishlist.products = wishlist.products.filter(
    (product) => !addedProducts.includes(product._id)
  );
  await wishlist.save();

  const updatedCart = await findUserCart(userId);
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
    const cartItem = cart.items.find((item) => item.id === itemId);
    if (cartItem) {
      cart.items = cart.items.filter((item) => item.id !== itemId);
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

  const cartItem = cart.items.find((item) => item.id === itemId);

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
    if (cartItem.quantity >= MAX_QUANTITY) {
      return handleErrorResponse(res, 400, "Maximum Quantity Exceeded", {
        title: "Maximum Quantity Exceeded",
        description: "You can only add up to 4 units of this item",
      });
    }

    if (product.stock < 1 || cartItem.quantity >= product.stock) {
      return handleErrorResponse(res, 400, "Insufficient Stock", {
        title: "Insufficient Stock",
        description: "No stock available to increment",
      });
    }
    cartItem.quantity += 1;

  } else if (action === 'decrement') {
    if (cartItem.quantity === 1) {
      return handleErrorResponse(res, 400, "Quantity cannot be less than 1", {
        title: "Invalid Quantity",
        description: "Cannot decrement quantity below 1",
      });
    }
    cartItem.quantity -= 1;
  }

  await cart.save();

  const updatedCart = await findUserCart(req.user._id);
  const formattedCart = formatCart(updatedCart, req.user);
  return res.json(formattedCart);
});


/*  
    Route: POST api/user/cart/verify
    Purpose: verify and clear out-of-stock items from the cart
*/
export const verifyCart = asyncHandler(async (req, res) => {
  const cart = await findUserCart(req.user._id);
  if (!cart) {
    return handleErrorResponse(res, 404, "Cart not found", {
      title: "Invalid Cart",
      description: "This cart is not available",
    });
  }

  const outOfStockItems = cart.items.filter(item => item.product.stock === 0 || item.quantity > item.product.stock);
  
  if (outOfStockItems.length > 0) {
    return handleErrorResponse(res, 400, "Items are out of Stock or quantity exceeds available stock", {
      title: "Out of Stock items",
      description: "Please remove or adjust the quantity of out-of-stock items to continue",
    });
  }

  return res.json({message: "Cart is good to proceed"});
});

