const AppError = require("../utils/appError");
const {
  ValidationError,
  DatabaseError,
  UniqueConstraintError,
} = require("sequelize");

// Handle Sequelize validation errors
const handleSequelizeValidationError = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle unique constraint violations
const handleUniqueConstraintError = (err) => {
  const field = err.errors[0].path;
  const message = `Duplicate value for ${field}. Please use a different value.`;
  return new AppError(message, 400);
};

// Handle database connection/query errors
const handleDatabaseError = (err) => {
  console.error("Database Error:", err);
  return new AppError("Database operation failed. Please try again.", 500);
};

// Handle foreign key constraint violations
const handleForeignKeyConstraintError = (err) => {
  const message = "Referenced record does not exist.";
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // Handle Sequelize-specific errors
    if (err instanceof ValidationError) {
      error = handleSequelizeValidationError(err);
    }
    if (err instanceof UniqueConstraintError) {
      error = handleUniqueConstraintError(err);
    }
    if (err instanceof DatabaseError) {
      error = handleDatabaseError(err);
    }
    if (err.name === "SequelizeForeignKeyConstraintError") {
      error = handleForeignKeyConstraintError(err);
    }

    sendErrorProd(error, res);
  }
};
