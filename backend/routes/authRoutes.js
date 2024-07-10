import express from "express";
import { authenticateUser, createUser, googleAuth, logoutUser, refreshToken, resendOTP, validateOTP, verifyAuth } from "../controllers/authController.js";
import { googleAuthValidator, loginValidator, otpValidator, registrationValidator, resendOtpValidator } from "../utils/validators/authValidators.js";
import validatorMiddleware from "../middleware/validatorMiddleware.js";
import {isAuthenticated} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/login', loginValidator, validatorMiddleware, authenticateUser);
router.post('/register', registrationValidator, validatorMiddleware, createUser);
router.post('/logout', logoutUser);

router.get('/verify-auth',  isAuthenticated, verifyAuth)

router.get('/google', googleAuthValidator, validatorMiddleware, googleAuth);

router.post('/refresh-token', refreshToken);

router.post('/otp-resend', resendOtpValidator, validatorMiddleware, resendOTP);
router.post('/otp-validate', otpValidator, validatorMiddleware, validateOTP);

export default router