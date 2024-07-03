import { validationResult } from "express-validator";
import handleErrorResponse from "../utils/handleErrorResponse.js";

export default (req, res, next) => {
  const errors_ = validationResult(req);
  if (!errors_.isEmpty()) {
    const formattedErrors = {};
    errors_.array().forEach((error) => {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = error.msg;
      }
    });

    return handleErrorResponse(res, 400,
      "Invalid fields",
      {
        title: "Innvalid Fields",
        description: "Please Provide necessory fields",
        errors: formattedErrors,
      },
    );
  }
  next();
};
