const express = require("express");
const licenseController = require("../controllers/licenseController");
const validatedLicense = require("../middlewares/validateLicense");
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect); // Protect all routes after this middleware
router.use(authController.restrictTo('admin','user','license','viewer')); // Restrict all routes 
router.get("/getLicenseById", licenseController.getLicenseById);
// Get all licenses
router.get("/getAllLicenses", licenseController.getAllLicenses);
// Get license by vehicle ID
router.get(
  "/getLicenseByVehicleId/:id",
  licenseController.getLicenseByVehicleId
);
// Get expired licenses
router.get("/getExpiredLicenses", licenseController.getExpiredLicenses);
// Get unique field values for filtering
router.get("/getUniqueFieldValues", licenseController.getUniqueFieldValues);
// Get expiring licenses
router.get("/getExpiringLicenses", licenseController.getExpiringLicensesBefore);

router.use(authController.restrictTo('admin','user','license',)); // Restrict all routes 
router.post(
  "/createLicense",
  validatedLicense.validateLicenseData,
  licenseController.createLicense
);

//Update License
router.patch("/updateLicense/:id", licenseController.updateLicense);
// Delete License
// Delete a license by ID
router.delete("/deleteLicense/:id", licenseController.deleteLicense);

// Get all licenses with associated vehicles
router.get(
  "/getAllLicensesWithVehicles",
  licenseController.getAllLicensesWithVehicles
);

module.exports = router;
