const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// Public routes
router.post("/login", authController.login);

// Protected routes
router.use(authController.protect);

router.post("/logout", authController.logout);
router.get("/me", userController.getMe, userController.getUser);

// Admin only routes
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser); // Only admins can create users

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
