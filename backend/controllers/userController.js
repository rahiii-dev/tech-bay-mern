import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { ACTIVE_PRODUCT_PIPELINE } from "../utils/pipelines/product.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import handleResponse from "../utils/handleResponse.js";
import { generateFileURL } from "../utils/generateFileUrl.js";

/*  
        Route: GET api/profile
        Purpose: See user Profile
*/
export const userProfile = asyncHandler(async (req, res) => {
  const user = await User.find({ _id: req.user?._id }).select("-password");
  console.log(user);
  console.log(req.user);
  if (user) {
    return res.json(user);
  }

  return res.status(404).json({ message: "User not found" });
});

/*  
    Route: GET api/user/home
    Purpose: send data for user home page
*/
export const userHome = asyncHandler(async (req, res) => {
  const NEWEST_PRODUCT_PIPELINE = [
    ...ACTIVE_PRODUCT_PIPELINE,
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 4,
    },
  ];

  const TOP_PRODUCT_PIPELINE = [
    ...ACTIVE_PRODUCT_PIPELINE,
    {
      $sort: { createdAt: 1 },
    },
    {
      $limit: 4,
    },
  ];

  const newest_products = await Product.aggregate(NEWEST_PRODUCT_PIPELINE);
  const top_products = await Product.aggregate(TOP_PRODUCT_PIPELINE);

  newest_products.forEach((product) => {
    product.thumbnail = generateFileURL(product.thumbnail);
    product.images = product.images.map((image) => generateFileURL(image));
  });

  top_products.forEach((product) => {
    product.thumbnail = generateFileURL(product.thumbnail);
    product.images = product.images.map((image) => generateFileURL(image));
  });

  return res.json({
    newest_products,
    top_products,
  });
});

/*  
    Route: GET api/user/proucts
    Purpose: list products for user and filter according to query
*/
export const userProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const pipeline = [...ACTIVE_PRODUCT_PIPELINE];
  if (category) {
    pipeline.push({
      $match: {
        "category._id": category,
      },
    });
  }

  const products = await Product.aggregate(category);

  products.forEach((product) => {
    product.thumbnail = generateFileURL(product.thumbnail);
    product.images = product.images.map((image) => generateFileURL(image));
  });

  return handleResponse(
    res,
    "Products Fetched Succesfully",
    {},
    {
      productsCount: products.length,
      products,
    }
  );
});

/*  
    Route: GET api/user/categories
    Purpose: list categories for user
*/
export const userCategories = asyncHandler(async (req, res) => {
  const categories = Category.find({ isDeleted: false });
  return handleResponse(
    res,
    "Products Fetched Succesfully",
    {},
    {
      categoriesCount: categories.length,
      categories,
    }
  );
});
