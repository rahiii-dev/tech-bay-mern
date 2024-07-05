import express from "express";
import { createBrand, deleteBrand, editBrand, getBrands, restoreBrand } from "../../controllers/brandController.js";
import { validateBrandCreation, validateBrandEdit, validateBrandId } from "../../utils/validators/brandValidators.js";
import validatorMiddleware from '../../middleware/validatorMiddleware.js';

const router = express.Router();

router.post('/brands', validateBrandCreation, validatorMiddleware, createBrand);
router.get('/brands', getBrands);

router.put('/brands/:id', validateBrandEdit, validatorMiddleware, editBrand);

router.delete('/brands/:id', validateBrandId, validatorMiddleware, deleteBrand);
router.put('/brands/restore/:id', validateBrandId, validatorMiddleware, restoreBrand);

export default router;
