import express from "express";
import { createCategory, deleteCategory, editCategory, getCategories, restoreCategory } from "../../controllers/categoryController.js";
import { validateCategoryCreation, validateCategoryEdit, validateCategoryId } from "../../utils/validators/categoryValidators.js";
import validatorMiddleware from '../../middleware/validatorMiddleware.js';

const router = express.Router();

router.post('/categories', validateCategoryCreation, validatorMiddleware, createCategory);
router.get('/categories', getCategories);

router.put('/categories/:id', validateCategoryEdit, validatorMiddleware, editCategory);

router.delete('/categories/:id', validateCategoryId, validatorMiddleware, deleteCategory);
router.put('/categories/restore/:id', validateCategoryId, validatorMiddleware, restoreCategory);

export default router