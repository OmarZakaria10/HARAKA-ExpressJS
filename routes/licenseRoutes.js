const express = require("express");
const licenseController = require("../controllers/licenseController");
const validatedLicense = require("../middlewares/validateLicense");
const router = express.Router();

router.post("/createLicense", 
  validatedLicense.validateLicenseData,
  licenseController.createLicense,
);

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

router.get(
  "/getLicenseByVehicleId/:id",
  licenseController.getLicenseByVehicleId
);
// Get expired licenses
router.get("/getExpiredLicenses", licenseController.getExpiredLicenses);
// Get unique field values for filtering
router.get("/getUniqueFieldValues", licenseController.getUniqueFieldValues);

// Get expiring licenses
router.get("/getExpiringLicenses", licenseController.getExpiringLicenses);

module.exports = router;
