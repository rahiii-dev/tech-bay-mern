import asyncHandler from "express-async-handler";
import { clearToken, generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { oauth2Client } from "../config/googleConfig.js";
import axios from "axios";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import { sendOtpEmail } from "../utils/sendOtp.js";
import OTP from "../models/OTP.js";
import handleResponse from "../utils/handleResponse.js";

function handleUserData(userData){
  return {
    _id: userData._id,
    fullName: userData.fullName,
    email: userData.email,
    phone_no: userData.phone_no,
    isAdmin: userData.isAdmin,
    isStaff: userData.isStaff,
    isBlocked: userData.isBlocked,
    isVerified: userData.isVerified
  }
}

export const authenticateUser = asyncHandler(async (req, res) => {
  /*  
        Route: POST api/auth/login
        Purpose: Authenticate user
  */
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    if (user.isBlocked) {
      return handleErrorResponse(res, 403, "Your account is blocked",
        {
          title: "Account blocked",
          description: "Please contact support for further assistance.",
        },
        "Authorization"
      );
    }

    if(!user.isVerified){
      await sendOtpEmail(user.email);
      return handleErrorResponse(res, 403, "Your account is not verified",
        {
          title: "Account is not verified",
          description: "Please verify with otp.",
        },
        'Account'
      );
    }

    generateToken(user, res);
    return handleResponse(res, "Autheticated succesfully", handleUserData(user))
  } 
    
  return handleErrorResponse(res, 401, "Invalid email or password");
});

export const createUser = asyncHandler(async (req, res) => {
  /*  
      Route: POST api/auth/register
      Purpose: Create user and send otp for verification
  */
  const { fullName, email, password, phone_no } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists && userExists.isVerified) {
    return handleErrorResponse(res, 400, "User already exists");
  }

  if (userExists && !userExists.isVerified) {
    await sendOtpEmail(userExists.email);
    return handleResponse(res,"OTP has been sent to your email", '', {
      title: `You have an account`,
      description: "Please verify your email to continue",
    })
  }

  const user = new User({
    fullName,
    email,
    phone_no,
    password,
  });

  try {
    await user.save();
    await sendOtpEmail(user.email);
    return handleResponse(res,"OTP has been sent to your email",'', {
      title: `You account is created`,
      description: "Please verify your email to continue",
    }) 
  } catch (error) {
    return handleErrorResponse(res, 400, "Registration failed");
  }
});

export const resendOTP = asyncHandler(async (req, res) => {
  /*  
      Route: POST api/auth/otp-resend
      Purpose: resend otp  to user
  */
  const { email } = req.body;
  const userExist = await User.findOne({ email }).select("-password");
  if (userExist) {
    await sendOtpEmail(email);
    return handleResponse(res, "New OTP has been sent to your email", {}, {
          title: `New OTP is sent to your email`,
          description: "Please check your email",
        })
  }

  return handleErrorResponse(res, 404, "Failed to resend OTP", {
        title: `Failed to resend OTP`,
        description: "Invalid user account",
      })
});

export const validateOTP = asyncHandler(async (req, res) => {
  /*  
      Route: POST api/auth/otp-validate
      Purpose: Validaate otp send to user
  */
  const { email, otp } = req.body;
  const otpExist = await OTP.findOne({ email });
  const userExist = await User.findOne({ email }).select("-password");

  if (otpExist && userExist && otpExist.otp === otp) {
    userExist.isVerified = true;
    await userExist.save();
    generateToken(userExist, res);
    return handleResponse(res, "OTP has been verified", handleUserData(userExist), {
          title: `Your email is verified`,
        })
  }

  return handleErrorResponse(res, 404, "OTP verification failed", {
    title: `Inavlid or expired otp`,
    description: "Please resend otp to verify",
  })
});

export const googleAuth = asyncHandler(async (req, res) => {
  /*  
        Route: POST api/auth/google
        Purpose: login user with google
    */

  const code = req.query.code;
  let userData;

  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    userData = userRes.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message || "Serrver Error");
  }

  let user = await User.findOne({ email: userData.email });

  if (user && user.isBlocked) {
    if (user.isBlocked) {
      return handleErrorResponse(res, 403, "Your account is blocked",
        {
          title: "Account blocked",
          description: "Please contact support for further assistance.",
        },
        "Authorization"
      );
    }
  }

  if (!user) {
    user = new User({
      email: userData.email,
      fullName: userData.name,
      password: userData.id,
      isVerified: true
    });
    await user.save();
    res.status(201);
  }

  generateToken(user, res);
  return handleResponse(res, "Autheticated succesfully", handleUserData(user))
});

export const logoutUser = asyncHandler(async (req, res) => {
  /*  
        Route: POST api/auth/logout
        Purpose: Logout user
    */
  clearToken(res);
  res.status(200).json({ message: "Logged out successfully" });
});
