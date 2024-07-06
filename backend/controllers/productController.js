import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import handleResponse from "../utils/handleResponse.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import { generateFileURL } from "../utils/generateFileUrl.js";

function handleProduct(product) {
  return {
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    thumbnail: product.thumbnail ? generateFileURL(product.thumbnail) : null,
    images: product.images.map(image => generateFileURL(image)),
    isActive: product.isActive,
    category: product.category,
    brand: product.brand,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

/*  
    Route: POST api/admin/products
    Purpose: Create a new product
*/
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, brand, isActive } = req.body;

  const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].path : null;
  const images = req.files?.images ? req.files.images.map((file) => file.path) : [];

  const product = new Product({
    name,
    description,
    price,
    stock,
    images,
    thumbnail,
    category,
    brand,
  });

    await product.save();
  res.status(201);
  return handleResponse(res, "Product Created", {}, handleProduct(product));
});

/*  
    Route: PUT api/admin/products/:id
    Purpose: Edit a product
*/
export const editProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    images,
    thumbnail,
    category,
    brand,
  } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return handleErrorResponse(res, 404, "Product not found");
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stock = stock || product.stock;
  product.images = images || product.images;
  product.thumbnail = thumbnail || product.thumbnail;
  product.category = category || product.category;
  product.brand = brand || product.brand;

  await product.save();

  return handleResponse(res, "Product updated", {}, handleProduct(product));
});

/*  
    Route: GET api/admin/products
    Purpose: Get all products 
*/
export const getProducts = asyncHandler(async (req, res) => {
  const filter = req.query?.filter;
  let products;

  if (filter === "active") {
    products = await Product.find({ isActive: true });
  } else {
    products = await Product.find();
  }

  return handleResponse(
    res,
    "Products retrieved",
    {},
    { productCount: products.length, products: products.map(handleProduct) }
  );
});

/*  
    Route: GET api/admin/product/:id
    Purpose: Get all products 
*/
export const getSingleProduct = asyncHandler(async (req, res) => {
  const prID = req.params.id;

  const product = await Product.findOne({_id: prID});

  if(!product){
    return handleErrorResponse(res, 404, "Product not found")
  }

  return handleResponse(res, "Product retrieved", {}, {...handleProduct(product)});
});

/*  
    Route: DELETE api/admin/products/:id
    Purpose: Soft delete a product
*/
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return handleErrorResponse(res, 404, "Product not found");
  }
  await product.softDelete();
  return handleResponse(res, "Product soft-deleted");
});

/*  
    Route: PATCH api/admin/products/restore/:id
    Purpose: Restore a soft-deleted product
*/
export const restoreProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return handleErrorResponse(res, 404, "Product not found", {});
  }
  await product.restore();
  return handleResponse(res, "Product restored");
});
