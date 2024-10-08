import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";
import handleResponse from "../utils/handleResponse.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import { escapeRegex } from "../utils/helpers/appHelpers.js";

export function handleBrand(brand) {
  return {
    _id: brand._id,
    name: brand.name,
    description: brand.description,
    isDeleted: brand.isDeleted,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  };
}

/*  
    Route: POST api/admin/brands
    Purpose: Create a new brand
*/
export const createBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const brandExist = await Brand.findOne({ name: { $regex: new RegExp(name, "i") } });
  if (brandExist) {
    return handleErrorResponse(res, 401, "Brand already exists");
  }

  const brand = new Brand({ name, description });
  await brand.save();
  res.status(201);
  return handleResponse(res, "Brand Created", {}, handleBrand(brand));
});

/*  
    Route: PUT api/admin/brands/:id
    Purpose: Edit a brand
*/
export const editBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    return handleErrorResponse(res, 404, "Brand not found");
  }

  const brandExist = await Brand.findOne({ _id: { $ne: id }, name });
  if (brandExist) {
    return handleErrorResponse(res, 401, "Brand already exists");
  }

  brand.name = name || brand.name;
  brand.description = description || brand.description;

  await brand.save();

  return handleResponse(res, "Brand updated", {}, handleBrand(brand));
});

/*  
    Route: GET api/admin/brands
    Purpose: Get all brands 
*/
export const getBrands = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, filter } = req.query;

  const myCustomLabels = {
    totalDocs: 'totalBrands',
    docs: 'brands',
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
  
  const brands = await Brand.paginate(query, options);

  return res.json({ ...brands });
});

/*  
    Route: DELETE api/admin/brands/:id
    Purpose: Soft delete a brand
*/
export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return handleErrorResponse(res, 404, "Brand not found");
  }
  await brand.softDelete();
  return handleResponse(res, "Brand soft-deleted");
});

/*  
    Route: PATCH api/admin/brands/restore/:id
    Purpose: Restore a soft-deleted brand
*/
export const restoreBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return handleErrorResponse(res, 404, "Brand not found", {});
  }
  await brand.restore();
  return handleResponse(res, "Brand restored");
});
