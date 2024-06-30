import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      type: "Authorization",
      message: "Authentication token is required",
      extraMessage: {
        title: "Authorization failed",
        description: "Please log in again.",
      },
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded?.id).select(
      "fullName email isBlocked isAdmin isStaff"
    );

    if (req.user?.isBlocked) {
      return res.status(403).json({
        type: "Authorization",
        message: "Your account is blocked",
        extraMessage: {
          title: "Account blocked",
          description: "Please contact support for further assistance.",
        },
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      type: "Authorization",
      message: "Invalid or expired token",
      extraMessage: {
        title: "Token error",
        description: "Please log in again.",
      },
    });
  }
};

export const isStaff = (req, res, next) => {
  if (req.user?.isStaff) {
    return next();
  }

  return res.status(403).json({
    type: "Authorization",
    message: "Access denied",
    extraMessage: {
      title: "Insufficient privileges",
      description: "Staff privileges are required to perform this action.",
    },
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }

  return res.status(403).json({
    type: "Authorization",
    message: "Access denied",
    extraMessage: {
      title: "Insufficient privileges",
      description: "Admin privileges are required to perform this action.",
    },
  });
};
