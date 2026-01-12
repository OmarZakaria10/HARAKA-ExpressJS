const express = require("express");
const militaryLicenseController = require("../controllers/MilitaryLicenseController");
const authController = require("../controllers/authController");
const router = express.Router();

// All routes MUST be authenticated
router.use(authController.protect);

// All roles allowed to read and create
router.use(authController.restrictTo("admin", "user", "viewer", "license"));

// Public for the allowed roles (admin, user, viewer)
router.get("/getAllMilitaryLicenses", militaryLicenseController.getAllMilitaryLicenses);
router.post("/createMilitaryLicense", militaryLicenseController.createMilitaryLicense);
router.get("/getUniqueFieldValues", militaryLicenseController.getUniqueMilitaryFieldValues);
router.get("/byChassisNumber/:chassis_number", militaryLicenseController.getMilitaryLicenseByChassisNumber);
router.get("/byVehicleId/:vehicleId", militaryLicenseController.getMilitaryLicenseByVehicleId);
router.get("/:id", militaryLicenseController.getMilitaryLicenseById);

// Update → only admin + user
router.patch(
  "/:id",
  authController.restrictTo("admin", "user", "license"),
  militaryLicenseController.updateMilitaryLicense
);

// Delete → only admin
router.delete(
  "/:id",
  authController.restrictTo("admin"),
  militaryLicenseController.deleteMilitaryLicense
);

module.exports = router;
