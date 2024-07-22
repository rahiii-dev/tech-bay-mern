import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import { cartPopulateOptions, formatCart } from "./cartController.js";
import Order, { ORDER_STATUS, PAYMENT_METHODS } from "../models/Order.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import {
  calculateDateAfterDays,
  escapeRegex,
} from "../utils/helpers/appHelpers.js";
import Product from "../models/Product.js";

const generateOrderNumber = () => {
  return `ORD-${Date.now()}`;
};

/*  
    Route: POST api/admin/order
    Purpose: Create new order
*/
export const createOrder = asyncHandler(async (req, res) => {
  const { cartId, addressId, paymentMethod } = req.body;
  const userId = req.user._id;

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return handleErrorResponse(res, 404, "Invalid payment method");
  }

  const cart = await Cart.findOne({ _id: cartId, user: userId }).populate(
    cartPopulateOptions
  );

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
      productID: item.product._id,
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
  };

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
    orderNumber: generateOrderNumber(),
  });

  if (paymentMethod === "cod") {
    order.status = "Processing";
  }

  const createdOrder = await order.save();
  await Cart.findByIdAndDelete(cart._id);

  for (const item of order.orderedItems) {
    await Product.findByIdAndUpdate(item.productID, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json(createdOrder);
});

/*  
    Route: GET api/admin/orders
    Purpose: List and filter orders for admin
*/
export const getAdminOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const filter = {};

  const myCustomLabels = {
    totalDocs: "totalOrders",
    docs: "orders",
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: myCustomLabels,
    populate: {
      path: "user",
      select: "email fullName",
    },
    sort: { createdAt: -1 },
  };

  if (status && ORDER_STATUS.includes(status)) {
    filter.status = status;
  }

  if (search) {
    const regTerm = escapeRegex(search.trim());
    filter.orderNumber = { $regex: regTerm, $options: "i" };
  }

  const orders = await Order.paginate(filter, options);

  res.status(200).json(orders);
});

/*  
    Route: GET api/admin/order/:orderId
    Purpose: show details of order
*/
export const getOrderDetail = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate({
    path: "user",
    select: "fullName email",
  });

  if (!order) {
    return handleErrorResponse(res, 404, "Order not found");
  }

  res.status(200).json(order);
});

/*  
    Route: PUT api/admin/order/:orderId
    Purpose: change status
*/
export const updateOrderDetail = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return handleErrorResponse(res, 404, "Order not found");
  }

  if (order.status === "Delivered") {
    return handleErrorResponse(res, 403, "Order is already delivered");
  }

  if (order.status === "Cancelled") {
    return handleErrorResponse(res, 403, "Order is already canelled");
  }

  if (status && ORDER_STATUS.includes(status)) {
    let deliveryDate = null;

    if (status === "Shipped") {
      deliveryDate = calculateDateAfterDays(3);
    } else if (status === "Delivered") {
      deliveryDate = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { deliveryDate, status } },
      { new: true }
    );

    return res.json(updatedOrder);
  }

  return handleErrorResponse(res, 404, "Status not found");
});

/*  
    Route: POST api/user/order/list
    Purpose: Get user specific orders
*/
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(orders);
});
/*  
    Route: POST api/user/order/:orderId/cancel
    Purpose: cancel order
*/
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { productId, reason } = req.body;
  const userId = req.user._id;

  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    return handleErrorResponse(res, 404, "Order not found");
  }

  if (order.status === "Delivered") {
    return handleErrorResponse(res, 403, "Order is already Delivered");
  }

  if (order.status === "Shipped") {
    return handleErrorResponse(res, 403, "Order is already Shipped");
  }

  await order.cancelItem(productId, reason);

  const cancelledProduct = order.orderedItems.find((item) => {
    return item.productID.toString() === productId.toString();
  });

  if(cancelledProduct){
    const amountToReduce = cancelledProduct.price * cancelledProduct.quantity;
    order.orderedAmount.subtotal -= amountToReduce;
    order.orderedAmount.total -= amountToReduce;
    
    await Product.findByIdAndUpdate(cancelledProduct.productID, {
      $inc: { stock: cancelledProduct.quantity },
    });

    const allItemsCancelled = order.orderedItems.every(item => item.cancelled);
    if (allItemsCancelled) {
      order.status = "Cancelled";
      order.orderedAmount.deliveryFee = 0;
    }

    await order.save();
  }
  
  res.status(200).json({ message: "Order cancelled successfully" });
});
