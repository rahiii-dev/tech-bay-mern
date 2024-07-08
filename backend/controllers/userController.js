import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { ACTIVE_PRODUCT_PIPELINE } from "../utils/pipelines/product.js";
import { generateFileURL } from "../utils/generateFileUrl.js";
import mongoose from "mongoose";
import { handleProduct } from "./productController.js";

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
        "category._id": new mongoose.Types.ObjectId(category),
      },
    });
  }

  const products = await Product.aggregate(pipeline);

  products.forEach((product) => {
    product.thumbnail = generateFileURL(product.thumbnail);
    product.images = product.images.map((image) => generateFileURL(image));
  });

  return res.json({
    productsCount: products.length,
    products,
  });
});

/*  
    Route: GET api/user/product/:id
    Purpose: get product using product id
*/
export const userGetProductDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (id) {
    const product = await Product.findOne({ _id: id });

    if (product) {
      const related_products = await Product.find({
        _id: { $ne : product.id},
        category: product.category,
        isActive: true
      });
      related_products.forEach((product) => {
        product.thumbnail = generateFileURL(product.thumbnail);
        product.images = product.images.map((image) => generateFileURL(image));
      });
      return res.json({ product: handleProduct(product), related_products });
    }
  }
  return res.json({ product: {}, related_products: [] });
});

/*  
    Route: GET api/user/categories
    Purpose: list categories for user
*/
export const userCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isDeleted: false });
  return res.json({
    categoriesCount: categories.length,
    categories,
  });
});
