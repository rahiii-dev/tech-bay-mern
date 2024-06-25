import asyncHandler from "express-async-handler";
import { clearToken, generateToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const authenticateUser = asyncHandler(async (req, res) => {
  /*  
        Route: POST api/auth/login
        Purpose: Authenticate user
  */
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    generateToken(user, res);
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone_no: user.phone_no,
      isAdmin: user.isAdmin,
      isStaff: user.isStaff,
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
  const { fullName, email, password, phone_no} = req.body;
  let isAdmin = false, isStaff = false;
  if(req.user?.isAdmin){
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
    isStaff
  });

  if (await user.save()) {
    res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone_no: user.phone_no,
        isAdmin: user.isAdmin,
        isStaff: user.isStaff,
      });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


export const logoutUser = asyncHandler(async (req, res) => {
    /*  
        Route: POST api/auth/logout
        Purpose: Logout user
    */
    clearToken(res)
    res.status(200).json({ message: 'Logged out successfully' });
  });
