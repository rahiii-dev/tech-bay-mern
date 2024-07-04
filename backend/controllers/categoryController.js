import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import handleResponse from "../utils/handleResponse.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";

function handleCategory(category) {
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

  const categoryExist = await Category.findOne({ name });
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

  const categoryExist = await Category.findOne({ _id : {$ne : id} , name });
  if (categoryExist) {
    return handleErrorResponse(res, 401, "Category already exists");
  }

  category.name = name || category.name;
  category.description = description || category.description;

  await category.save();

  return handleResponse(res, "Category updated", {}, handleCategory(category));
});

/*  
    Route: GET api/admin/categories
    Purpose: Get all categories 
*/
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return handleResponse(
    res,
    "Category Created",
    {},
    { categoryCount: categories.length, categories }
  );
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
