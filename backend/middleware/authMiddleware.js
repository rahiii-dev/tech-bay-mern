import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required", extraMessage: "Please log in." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded?.id).select('fullName email isBlocked isAdmin isStaff')
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Invalid or expired token", extraMessage: "Please log in again." });
  }
};

export const isStaff = (req, res, next) => {
  if (req.user?.isStaff) {
    return next();
  }

  return res.status(403).json({ message: "Access denied", extraMessage: "Staff privileges are required to perform this action." });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }

  return res.status(403).json({ message: "Access denied", extraMessage: "Admin privileges are required to perform this action." });
};
