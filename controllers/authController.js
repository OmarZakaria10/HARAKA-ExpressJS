const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};


exports.changeUserPassword = catchAsync(async (req, res, next) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    return next(new AppError('Please provide user ID and new password', 400));
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});


exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    where: { username },
    attributes: { include: ['password'] } // Explicitly include password for verification
  });

  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  // 3) Check if user is active
  if (!user.active) {
    return next(new AppError("Your account has been deactivated", 401));
  }

  // 4) If everything ok, send token
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    try {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Please log in to get access.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findByPk(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists.", 401));
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Password recently changed! Please log in again.", 401));
  }

  req.user = user;
  next();
    } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};