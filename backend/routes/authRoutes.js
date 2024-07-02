import express from "express";
import { authenticateUser, createUser, googleAuth, logoutUser, resendOTP, validateOTP } from "../controllers/authController.js";

const router = express.Router();

router.get('/google', googleAuth)

router.post('/login', authenticateUser)
      .post('/register', createUser)
      .post('/logout', logoutUser)

router.post('/otp-resend', resendOTP)
      .post('/otp-validate', validateOTP)
export default router