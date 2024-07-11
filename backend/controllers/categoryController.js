import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import handleResponse from "../utils/handleResponse.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import { escapeRegex } from "../utils/helpers/appHelpers.js";

export function handleCategory(category) {
  return {
    _id: category._id,
    name: category.name,
    description: category.description,
    isDeleted: category.isDelted,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

/*  
    Route: POST api/admin/categories
    Purpose: Create a new category
*/
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const categoryExist = await Category.findOne({ name: { $regex: new RegExp(name, "i") } });
  if (categoryExist) {
    return handleErrorResponse(res, 401, "Category already exists");
  }

  const category = new Category({ name, description });
  await category.save();
  res.status(201);
  return handleResponse(res, "Category Created", {}, handleCategory(category));
});

/*  
    Route: PUT api/admin/categories/:id
    Purpose: Edit a category
*/
export const editCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return handleErrorResponse(res, 404, "Category not found");
  }

  const categoryExist = await Category.findOne({ _id: { $ne: id }, name });
  if (categoryExist) {
    return handleErrorResponse(res, 401, "Category already exists");
  }

  category.name = name || category.name;
  category.description = description || category.description;

  await category.save();

  return handleResponse(res, "Category updated", {}, handleCategory(category));
});

/*  
    Route: GET api/admin/categories?filter=active
    Purpose: Get all categories 
*/
export const getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, filter } = req.query;

  const myCustomLabels = {
    totalDocs: 'totalCategories',
    docs: 'categories',
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: myCustomLabels,
  };

  const query = {};

  if (filter === 'active') {
    query.isDeleted = false
  }

  if (search) {
    const regTerm = escapeRegex(search.trim());
    query.name = { $regex: regTerm, $options: 'i' }
  }

  const categories = await Category.paginate(query, options);

  return res.json({ ...categories });
});

/*  
    Route: DELETE api/admin/categories/:id
    Purpose: Soft delete a category
*/
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return handleErrorResponse(res, 404, "Category not found");
  }
  await category.softDelete();
  return handleResponse(res, "Category soft-deleted");
});

/*  
    Route: PATCH api/admin/categories/restore/:id
    Purpose: Restore a soft-deleted category
*/
export const restoreCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return handleErrorResponse(res, 404, "Category not found", {});
  }
  await category.restore();
  return handleResponse(res, "Category restored");
});
