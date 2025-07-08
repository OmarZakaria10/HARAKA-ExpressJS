const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [["createdAt", "ASC"]],
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  // 1) Check if required fields are present
  const requiredFields = ['username', 'password', 'role'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return next(new AppError(`Please provide ${field}`, 400));
    }
  }

  // 2) Validate role
  const validRoles = ["admin", "GPS", "license", "viewer", "user"];
  if (!validRoles.includes(req.body.role)) {
    return next(new AppError('Invalid role', 400));
  }

  // 3) Check if username already exists
  const existingUser = await User.findOne({
    where: { username: req.body.username }
  });

  if (existingUser) {
    return next(new AppError('Username already in use', 400));
  }

  // 4) Create user
  const userData = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  };

  const newUser = await User.create(userData);
  
  // 5) Remove sensitive data
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  // Prevent password update through this route
  if (req.body.password) {
    return next(new AppError('This route is not for password updates. Please use /updatePassword.', 400));
  }

  const [updated] = await User.update(req.body, {
    where: { id: req.params.id }
  });

  if (!updated) {
    return next(new AppError('No user found with that ID', 404));
  }

  const updatedUser = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // Soft delete by setting active to false
  const [updated] = await User.update(
    { active: false },
    { where: { id: req.params.id } }
  );

  if (!updated) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});



exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password) {
    return next(new AppError('This route is not for password updates. Please use /updatePassword.', 400));
  }

  // 2) Filter unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'username');

  // 3) Update user document
  const [updated] = await User.update(filteredBody, {
    where: { id: req.user.id }
  });

  if (!updated) {
    return next(new AppError('Error updating user', 400));
  }

  const updatedUser = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});