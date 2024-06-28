import asyncHandler from "express-async-handler";
import { clearToken, generateToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { oauth2Client } from "../config/googleConfig.js";
import axios from "axios";

export const authenticateUser = asyncHandler(async (req, res) => {
  /*  
        Route: POST api/auth/login
        Purpose: Authenticate user
  */
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    generateToken(user, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone_no: user.phone_no,
      isAdmin: user.isAdmin,
      isStaff: user.isStaff,
      isBlocked: user.isBlocked,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const createUser = asyncHandler(async (req, res) => {
  /*  
        Route: POST api/auth/register
        Purpose: Create user
  */
  const { fullName, email, password, phone_no } = req.body;
  let isAdmin = false,
    isStaff = false;
  if (req.user?.isAdmin) {
    isAdmin = req.body?.isAdmin;
    isStaff = req.body?.isStaff;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = new User({
    fullName,
    email,
    phone_no,
    password,
    isAdmin,
    isStaff,
  });

  if (await user.save()) {
    generateToken(user, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone_no: user.phone_no,
      isAdmin: user.isAdmin,
      isStaff: user.isStaff,
      isBlocked: user.isBlocked,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
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

  if (!user) {
    user = new User({
      email: userData.email,
      fullName: userData.name,
      password: userData.id
    });
    await user.save();
    res.status(201);
  }

  generateToken(user, res);

  return res.json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone_no: user.phone_no,
    isAdmin: user.isAdmin,
    isStaff: user.isStaff,
    isBlocked: user.isBlocked,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  /*  
        Route: POST api/auth/logout
        Purpose: Logout user
    */
  clearToken(res);
  res.status(200).json({ message: "Logged out successfully" });
});
