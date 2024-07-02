import User from "../models/User.js";
import HandleErrorResponse from "../utils/handleErrorResponse.js";
import { verifyToken } from "../utils/jwt.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token || req.headers["authorization"];

  if (!token) {
    return HandleErrorResponse(res, 401, "Authentication token is required", {
      title: "Authorization failed",
      description: "Please log in again.",
    }, "Authorization");
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded?.id).select(
      "fullName email isBlocked isAdmin isStaff"
    );

    if (!req.user) {
      return HandleErrorResponse(res, 403, "User not found", {
        title: "Authorization failed",
        description: "User not found. Please log in again.",
      }, "Authorization");
    }

    if (req.user.isBlocked) {
      return HandleErrorResponse(res, 403, "Your account is blocked", {
        title: "Account blocked",
        description: "Please contact support for further assistance.",
      }, "Authorization");
    }

    next();
  } catch (error) {
    console.error(error);
    return HandleErrorResponse(res, 403, "Invalid or expired token", {
      title: "Token error",
      description: "Please log in again.",
    }, "Authorization");
  }
};

export const isStaff = (req, res, next) => {
  if (req.user?.isStaff) {
    return next();
  }

  return HandleErrorResponse(res, 403, "Access denied", {
    title: "Insufficient privileges",
    description: "Staff privileges are required to perform this action.",
  }, "Authorization");
};

export const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }

  return HandleErrorResponse(res, 403, "Access denied", {
    title: "Insufficient privileges",
    description: "Admin privileges are required to perform this action.",
  }, "Authorization");
};
