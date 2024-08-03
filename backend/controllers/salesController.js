import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

const generateSalesReport = async (filterType, startDate, endDate, page=1, limit=10) => {
  const matchCriteria = {
    status: { $in: ["Delivered", "Shipped", "Processing"] },
  };

  if (filterType === "custom") {
    matchCriteria.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else {
    const currentDate = new Date();
    switch (filterType) {
      case "day":
        matchCriteria.createdAt = {
          $gte: new Date(currentDate.setDate(currentDate.getDate())),
        };
        break;
      case "week":
        matchCriteria.createdAt = {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
        };
        break;
      case "month":
        matchCriteria.createdAt = {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
        };
        break;
      case "year":
        matchCriteria.createdAt = {
          $gte: new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1)
          ),
        };
        break;
      default:
        break;
    }
  }

  const salesReport = await Order.aggregate([
    {
      $match: matchCriteria,
    },
    {
      $unwind: "$orderedItems",
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$orderedAmount.total" },
        numberOfOrders: { $sum: 1 },
        totalItemsSold: { $sum: "$orderedItems.quantity" },
        averageOrderValue: { $avg: "$orderedAmount.total" },
        totalDiscount: { $sum: "$orderedAmount.discount" },
        couponApplied: {
          $sum: { $cond: [{ $ifNull: ["$coupon", false] }, 1, 0] },
        },
      },
    },
  ]);


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


  const ordersInRange = await Order.paginate(matchCriteria, options);

  return {
    salesReport: salesReport[0] || {
      totalSales: 0,
      numberOfOrders: 0,
      totalItemsSold: 0,
      averageOrderValue: 0,
      totalDiscount: 0,
      couponApplied: 0,
    },
    ordersInRange,
  };
};

/*  
    Route: GET api/admin/salesreport
    Purpose: show sales report
    filter: all, custom, day, week, month
*/
export const getSalesReport = asyncHandler(async (req, res) => {
  const { filter = 'all', startDate, endDate } = req.query;

  try {
    const report = await generateSalesReport(filter, startDate, endDate);
    res.json(report);
  } catch (error) {
    throw new Error(error.message);
  }
});
