import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import { cartPopulateOptions, formatCart } from "./cartController.js";
import Order, { ORDER_STATUS } from "../models/Order.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import {
  calculateDateAfterDays,
  escapeRegex,
} from "../utils/helpers/appHelpers.js";
import Product from "../models/Product.js";
import Wallet from "../models/Wallet.js";
import Transaction, { PAYMENT_METHODS } from "../models/Transactions.js";
import paypal from "@paypal/checkout-server-sdk";
import paypalClient from "../utils/paypalClient.js";
import { convertToUSD } from "../utils/currencyConverter.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import { generateInvoicePDF } from "../utils/invoiceUtility.js";

/*  
    Route: POST api/user/order
    Purpose: Create new order
*/
export const createOrder = asyncHandler(async (req, res) => {
  const { cartId, addressId, couponId, paymentMethod } = req.body;
  const userId = req.user._id;

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return handleErrorResponse(res, 404, "Invalid payment method");
  }

  const exisistingOrder = await Order.findOne({ cart: cartId });
  let order = null;

  if (!exisistingOrder) {
    const cart = await Cart.findOne({ _id: cartId, user: userId }).populate(
      cartPopulateOptions
    );

    if (!cart) {
      return handleErrorResponse(res, 404, "Cart not found");
    }

    const outOfStockItems = cart.items.filter(
      (item) => item.product.stock === 0 || item.quantity > item.product.stock
    );
    if (outOfStockItems.length > 0) {
      return handleErrorResponse(
        res,
        400,
        "Items are out of Stock or quantity exceeds available stock",
        {
          title: "Out of Stock items",
          description:
            "Please remove or adjust the quantity of out-of-stock items to continue",
        }
      );
    }

    const formattedCart = formatCart(cart, req.user);

    let coupon = null;
    if (couponId) {
      coupon = await Coupon.findById(couponId);
      if (coupon) {
        const validation = coupon.validateCoupon(
          formattedCart.cartTotal.subtotal
        );
        if (!validation.valid) {
          return handleErrorResponse(res, 400, validation.message);
        }
      }
    }

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      return handleErrorResponse(res, 404, "Address not found");
    }

    const orderedItems = cart.items.map((item) => ({
      productID: item.product._id,
      name: item.product.name,
      price: item.product.price,
      images: item.product.imageUrls,
      thumbnail: item.product.thumbnailUrl,
      category: item.product.brand.category,
      brand: item.product.brand.name,
      quantity: item.quantity,
    }));

    const orderedAddress = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    };

    order = new Order({
      user: userId,
      orderedItems,
      orderedAmount: {
        subtotal: formattedCart.cartTotal.subtotal,
        total: formattedCart.orderTotal.total,
      },
      address: orderedAddress,
      cart: cart._id,
    });

    if (coupon) {
      const discountAmount =
        (formattedCart.cartTotal.subtotal * coupon.discount) / 100;
      const totalAfterDiscount =
        formattedCart.orderTotal.total - discountAmount;

      order.coupon = {
        couponId: coupon._id,
        couponCode: coupon.code,
        couponDiscount: coupon.discount,
      };
      order.orderedAmount.discount = discountAmount;
      order.orderedAmount.total = totalAfterDiscount;

      const user = await User.findById(req.user._id);
      if (!user.usedCoupons.includes(coupon._id)) {
        user.usedCoupons.push(coupon._id);
        await user.save();
      }
    }

    await Cart.findByIdAndDelete(order.cart);

    for (const item of order.orderedItems) {
      await Product.findByIdAndUpdate(item.productID, {
        $inc: { stock: -item.quantity },
      });
    }
  } else {
    order = exisistingOrder;

    if(!couponId && order.coupon.couponId) {
      const user = await User.findById(req.user._id);
      user.usedCoupons = user.usedCoupons.filter( coupon => coupon != order.coupon.couponId);
      await user.save();
      order.coupon = null;
    }
  }

  if (paymentMethod === "wallet") {
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return handleErrorResponse(res, 404, "Wallet not found");
    } else if (wallet.balance < order.orderedAmount.total) {
      return handleErrorResponse(res, 404, "Insufficient balance in wallet");
    } else {
      wallet.balance -= order.orderedAmount.total;
      await wallet.save();
    }
  }

  if (paymentMethod === "paypal") {
    const totalUSD = await convertToUSD(order.orderedAmount.total, "INR");
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalUSD.toFixed(2),
          },
        },
      ],
    });

    try {
      const paypalOrder = await paypalClient.execute(request);
      const createdOrder = await order.save();

      return res.status(201).json({
        orderID: createdOrder._id,
        paypalOrderID: paypalOrder.result.id,
      });
    } catch (error) {
      return handleErrorResponse(
        res,
        500,
        "Error creating PayPal order",
        error
      );
    }
  } else {
    const transaction = new Transaction({
      user: order.user,
      type: "DEBIT",
      amount: order.orderedAmount.total,
      description: "Item Purchase",
      order: order._id,
      paymentMethod,
    });

    await transaction.save();
    order.transaction = transaction._id;

    order.status = "Processing";

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

/*  
    Route: POST api/user/order/capture
    Purpose: Capture paypal order
*/
export const captureOrder = asyncHandler(async (req, res) => {
  const { orderID, paypalOrderID } = req.body;

  const order = await Order.findOne({ _id: orderID });

  if (!order) {
    return handleErrorResponse(res, 404, "Order not found");
  }

  const request = new paypal.orders.OrdersCaptureRequest(paypalOrderID);
  request.requestBody({});

  try {
    await paypalClient.execute(request);

    const transaction = new Transaction({
      user: order.user,
      type: "DEBIT",
      amount: order.orderedAmount.total,
      description: "Item Purchase",
      order: order._id,
      paymentMethod: "paypal",
      paymentId: paypalOrderID,
    });

    await transaction.save();
    order.transaction = transaction._id;
    order.status = "Processing";
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    return handleErrorResponse(res, 500, "Error capturing PayPal order", error);
  }
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
    populate: [
      {
        path: "user",
        select: "email fullName",
      },
      {
        path: "transaction",
        select: "paymentMethod",
      },
    ],
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

  const order = await Order.findById(orderId).populate([
    {
      path: "user",
      select: "email fullName",
    },
    {
      path: "transaction",
      select: "paymentMethod",
    },
  ]);

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
  const orders = await Order.find({
    user: req.user._id,
    status: { $ne: "Pending" },
  })
    .populate([
      {
        path: "user",
        select: "email fullName",
      },
      {
        path: "transaction",
        select: "paymentMethod",
      },
    ])
    .sort({
      createdAt: -1,
    });
  return res.status(200).json(orders);
});
/*  
    Route: POST api/user/order/:orderId/cancel
    Purpose: cancel order
*/
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { productId, reason } = req.body;
  const userId = req.user._id;

  const order = await Order.findOne({ _id: orderId, user: userId }).populate([
    {
      path: "user",
      select: "email fullName",
    },
    {
      path: "transaction",
      select: "paymentMethod",
    },
  ]);

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

  if (cancelledProduct) {
    const amountToReduce = cancelledProduct.price * cancelledProduct.quantity;
    // order.orderedAmount.subtotal -= amountToReduce;
    // order.orderedAmount.total -= amountToReduce;

    if (["wallet", "paypal"].includes(order.transaction.paymentMethod)) {
      const userWallet = await Wallet.findOne({ user: order.user });

      if (!userWallet) {
        const newUserWallet = new Wallet({
          user: order.user,
          balance: amountToReduce,
        });
        await newUserWallet.save();
      } else {
        userWallet.balance += amountToReduce;
        await userWallet.save();
      }

      const transaction = new Transaction({
        user: order.user,
        type: "CREDIT",
        amount: amountToReduce,
        description: "Cancelling Item",
        order: order._id,
        paymentMethod: "wallet",
        paymentId:
          order.transaction.paymentMethod === "paypal"
            ? order.transaction.paymentId
            : null,
      });
      await transaction.save();
    }

    await Product.findByIdAndUpdate(cancelledProduct.productID, {
      $inc: { stock: cancelledProduct.quantity },
    });

    const allItemsCancelled = order.orderedItems.every(
      (item) => item.cancelled
    );
    if (allItemsCancelled) {
      order.status = "Cancelled";
    }

    await order.save();
  }

  return res.status(200).json({ message: "Order cancelled successfully" });
});

/*  
    Route: POST api/user/order/:orderId/return
    Purpose: return order for user
*/
export const returnOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { productId, reason } = req.body;
  const userId = req.user._id;

  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    return handleErrorResponse(res, 404, "Order not found");
  }

  if (order.status !== "Delivered") {
    return handleErrorResponse(res, 403, "Order is not Delivered");
  }

  await order.returnItem(productId, reason);

  return res.status(200).json({ message: "Order returned" });
});

/*  
    Route: GET api/admin/order/returns
    Purpose: return order for user
*/
export const returnOrdersList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, confirmed = false } = req.query;

  if (!["false", "true"].includes(confirmed)) {
    return handleErrorResponse(res, 404, "confirmed can only be true or false");
  }

  const filter = {
    "orderedItems.returned": true,
    "orderedItems.returnConfirmed": confirmed,
  };

  const myCustomLabels = {
    totalDocs: "totalOrders",
    docs: "orders",
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: myCustomLabels,
    populate: [
      {
        path: "user",
        select: "email fullName",
      },
      {
        path: "transaction",
        select: "paymentMethod",
      },
    ],
    select: "orderedItems orderNumber user",
    sort: { updatedAt: -1 },
  };

  const orders = await Order.paginate(filter, options);

  const modifiedOrders = orders.orders.map((order) => {
    const filteredItems = order.orderedItems.filter(
      (item) => item.returned && confirmed
    );
    return { ...order._doc, orderedItems: filteredItems };
  });

  return res.status(200).json({ ...orders, orders: modifiedOrders });
});

/*  
    Route: POST api/admin/order/confirm-return
    Purpose: return order for user
*/
export const confirmReturn = asyncHandler(async (req, res) => {
  const { orderId, productId, stockUpdate = false } = req.body;

  const order = await Order.findOne({ _id: orderId }).populate([
    {
      path: "user",
      select: "email fullName",
    },
    {
      path: "transaction",
      select: "paymentMethod",
    },
  ]);

  if (!order) {
    return handleErrorResponse(res, 404, "Order not found");
  }

  if (order.status !== "Delivered") {
    return handleErrorResponse(res, 403, "Order is not Delivered");
  }

  const confirmedItem = order.confirmReturn(productId);
  const amountToReduce = confirmedItem.price * confirmedItem.quantity;

  const allItemsReturned = order.orderedItems.every((item) => item.returned);
  if (allItemsReturned) {
    order.status = "Returned";
  }

  await order.save();

  const userWallet = await Wallet.findOne({ user: order.user });

  if (!userWallet) {
    const newUserWallet = new Wallet({
      user: order.user,
      balance: amountToReduce,
    });
    await newUserWallet.save();
  } else {
    userWallet.balance += amountToReduce;
    await userWallet.save();
  }

  const transaction = new Transaction({
    user: order.user,
    type: "CREDIT",
    amount: amountToReduce,
    description: "Order Return",
    order: order._id,
    paymentMethod: "wallet",
    paymentId:
      order.transaction.paymentMethod === "paypal"
        ? order.transaction.paymentId
        : null,
  });
  await transaction.save();

  if (stockUpdate) {
    await Product.findByIdAndUpdate(confirmedItem.productID, {
      $inc: { stock: confirmedItem.quantity },
    });
  }

  return res.status(200).json({ message: "Order return confirmed" });
});

/*
  Route: GET /api/user/order/invoice-download
  Purpose: Download invoice for the user's order
 */
export const downloadOrderInvoice = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const { orderId } = req.query; 

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

  const order = await Order.findOne({ _id: orderId, user: userId }).populate([
    {
      path: "user",
      select: "email fullName",
    },
    {
      path: "transaction",
      select: "paymentMethod",
    },
  ]);

  if (!order) {
    res.status(404);
    throw new Error('Order not found or you do not have permission to access this order');
  }

  await generateInvoicePDF(order, res);
});