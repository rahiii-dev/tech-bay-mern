import { validationResult } from "express-validator";
import handleErrorResponse from "../utils/handleErrorResponse.js";
import { deleteFiles } from "../utils/deleteFiles.js";

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
        title: "Invalid Fields",
        description: "Please Provide necessory fields",
        errors: formattedErrors,
      },
    );
  }
  next();
};
