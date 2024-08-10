import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import User from "../models/Order.js";
import Product from "../models/Product.js";
import { calculateOverallPercentageChange, calculatePercentageChange, calculateTotal, getDailyCustomers, getDailyData, getDailyProfit, getDailySales } from "../utils/dashboardUtils.js";

export const getDashboardDetails = asyncHandler(async (req, res) => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 7);

  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(previousStartDate.getDate() - 7);

  const ordersData = await getDailyData(Order, startDate, endDate);
  const previousOrdersData = await getDailyData(Order, previousStartDate, startDate);

  const profitData = await getDailyProfit(Order, startDate, endDate);
  const previousProfitData = await getDailyProfit(Order, previousStartDate, startDate);

  const salesData = await getDailySales(Order, startDate, endDate);
  const previousSalesData = await getDailySales(Order, previousStartDate, startDate);

  const customersData = await getDailyCustomers(User, startDate, endDate);
  const previousCustomersData = await getDailyCustomers(User, previousStartDate, startDate);

  const ordersPercentageChange = calculatePercentageChange(ordersData);
  const profitPercentageChange = calculatePercentageChange(profitData);
  const salesPercentageChange = calculatePercentageChange(salesData);
  const customersPercentageChange = calculatePercentageChange(customersData);

  const totalOrders = calculateTotal(ordersData);
  const previousTotalOrders = calculateTotal(previousOrdersData);
  const totalOrdersPercentageChange = calculateOverallPercentageChange(totalOrders, previousTotalOrders);

  const totalProfit = calculateTotal(profitData);
  const previousTotalProfit = calculateTotal(previousProfitData);
  const totalProfitPercentageChange = calculateOverallPercentageChange(totalProfit, previousTotalProfit);

  const totalSales = calculateTotal(salesData);
  const previousTotalSales = calculateTotal(previousSalesData);
  const totalSalesPercentageChange = calculateOverallPercentageChange(totalSales, previousTotalSales);

  const totalCustomers = calculateTotal(customersData);
  const previousTotalCustomers = calculateTotal(previousCustomersData);
  const totalCustomersPercentageChange = calculateOverallPercentageChange(totalCustomers, previousTotalCustomers);

  const latestOrders = await Order.find({ createdAt: { $gte: startDate, $lt: endDate } })
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
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    const topSellingProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { $unwind: "$orderedItems" },
      { $group: {
          _id: "$orderedItems.productID",
          totalQuantity: { $sum: "$orderedItems.quantity" },
          totalSales: { $sum: "$orderedItems.price" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);
    
    const productIds = topSellingProducts.map(item => item._id);
    const products = await Product.find({ _id: { $in: productIds } });    
    
    const topSellingWithDetails = topSellingProducts.map(item => {
      const product = products.find(p => p._id.toString() === item._id.toString());
      return {
        ...item,
        productDetails: product
      };
    });

  res.status(200).json({
    ordersData: { dailyData: ordersPercentageChange, total: totalOrders, percentageChange: totalOrdersPercentageChange },
    profitData: { dailyData: profitPercentageChange, total: totalProfit, percentageChange: totalProfitPercentageChange },
    salesData: { dailyData: salesPercentageChange, total: totalSales, percentageChange: totalSalesPercentageChange },
    customersData: { dailyData: customersPercentageChange, total: totalCustomers, percentageChange: totalCustomersPercentageChange },
    latestOrders,
    topSellingProducts: topSellingWithDetails,
  });
});


