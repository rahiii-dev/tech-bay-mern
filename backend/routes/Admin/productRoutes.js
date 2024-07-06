import express from "express";
import {
  createProduct,
  editProduct,
  getProducts,
  deleteProduct,
  restoreProduct,
  getSingleProduct
} from "../../controllers/productController.js";
import {
  validateProductCreation,
  validateProductEdit,
  validateProductId
} from "../../utils/validators/productValidators.js";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import productUploader from "../../utils/multer/productStorage.js";


const router = express.Router();

router.get("/products", getProducts);
router.get("/product/:id", validateProductId, validatorMiddleware, getSingleProduct);

router.post("/products", productUploader,validateProductCreation, validatorMiddleware, createProduct);
router.put("/products/:id", productUploader, validateProductEdit, validatorMiddleware, editProduct);

router.delete("/products/:id", validateProductId, validatorMiddleware, deleteProduct);
router.put("/products/restore/:id", validateProductId, validatorMiddleware, restoreProduct);

export default router;
