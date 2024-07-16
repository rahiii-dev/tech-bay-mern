import express from "express";
import { addAddress, getAddresses, getSingleAddress, updateAddress } from "../../controllers/profileController.js";
import { addAddressValidator, updateAddressValidator } from "../../utils/validators/addressValidators.js";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const router = express.Router();

router.get('/addresses', getAddresses);
router.post('/addresses', addAddressValidator, validatorMiddleware ,addAddress);

router.get('/address/:id', getSingleAddress);
router.post('/address/:id', updateAddressValidator, validatorMiddleware ,updateAddress);

export default router;
