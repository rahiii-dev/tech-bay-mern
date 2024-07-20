import express from "express";
import { addAddress, changePassword, deleteAddress, getAddresses, getProfile, getSingleAddress, updateAddress, updateProfile } from "../../controllers/profileController.js";
import { addAddressValidator, updateAddressValidator } from "../../utils/validators/addressValidators.js";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const router = express.Router();

router.get('/', getProfile);
router.post('/', updateProfile);

router.put('/change-password', changePassword);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddressValidator, validatorMiddleware ,addAddress);

router.get('/address/:id', getSingleAddress);
router.post('/address/:id', updateAddressValidator, validatorMiddleware ,updateAddress);
router.delete('/address/:id', deleteAddress);

export default router;
