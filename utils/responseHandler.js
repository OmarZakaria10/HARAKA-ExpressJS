class ResponseHandler {
  static success(res, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      data,
    });
  }
  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json({
      status: "error",
      message,
    });
  }
  static fail(res, message, statusCode = 400) {
    return res.status(statusCode).json({
      status: "fail",
      message,
    });
  }
}
