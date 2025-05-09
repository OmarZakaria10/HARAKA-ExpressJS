const express = require("express");
const licenseController = require("../controllers/licenseController");
const router = express.Router();

router.post("/createLicense", licenseController.createLicense);

// Get license by id
router.get("/getLicenseById", licenseController.getLicenseById);
//Update License
router.patch("/updateLicense/:id", licenseController.updateLicense);
// Delete License
// Delete a license by ID
router.delete("/deleteLicense/:id", licenseController.deleteLicense);

// Get all licenses
router.get("/getAllLicenses", licenseController.getAllLicenses);
// Get all licenses with associated vehicles
router.get(
  "/getAllLicensesWithVehicles",
  licenseController.getAllLicensesWithVehicles
);
// Get expired licenses
router.get("/getExpiredLicenses", licenseController.getExpiredLicenses);
// Get unique field values for filtering
router.get("/getUniqueFieldValues", licenseController.getUniqueFieldValues);

// // Get licenses statistics
// router.get("/statistics", licenseController.getLicenseStatistics);

// // Get expiring licenses
router.get("/getExpiringLicenses", licenseController.getExpiringLicenses);

// // Get licenses by vehicle ID
// router.get("/:vehicleId", licenseController.getLicensesByVehicleId);

// // Check if a license is valid
// router.get("/:id/validity", licenseController.checkLicenseValidity);

// // Get a single license by ID
// router.get("/:id", licenseController.getLicenseById);

// // Update a license by ID
// router.patch("/:id", licenseController.updateLicense);

// // Delete a license by ID
// router.delete("/:id", licenseController.deleteLicense);

module.exports = router;
