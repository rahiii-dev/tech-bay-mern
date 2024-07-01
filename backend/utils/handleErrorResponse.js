const handleErrorResponse = (res, status, message, extraMessage={}, type="Error") => {
  return res.status(status).json({
    type : type,
    message: message,
    extraMessage: {...extraMessage}
  });
};

export default handleErrorResponse;
