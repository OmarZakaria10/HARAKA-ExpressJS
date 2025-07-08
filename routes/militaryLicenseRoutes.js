const express = require("express");
const militaryLicenseController = require("../controllers/MilitaryLicenseController");
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect); 
router.use(authController.restrictTo('admin','user','viewer'));
router.get("/getAllMilitaryLicenses", militaryLicenseController.getAllMilitaryLicenses);

router.post(
  "/createMilitaryLicense",
  militaryLicenseController.createMilitaryLicense
);

router.get("/getUniqueFieldValues", militaryLicenseController.getUniqueMilitaryFieldValues);

router
  .route("/:id")
  .get(militaryLicenseController.getMilitaryLicenseById)
  .patch(militaryLicenseController.updateMilitaryLicense)
  .delete(militaryLicenseController.deleteMilitaryLicense);

router.get(
  "/byChassisNumber/:chassis_number",
  militaryLicenseController.getMilitaryLicenseByChassisNumber
);

router.get(
  "/byVehicleId/:vehicleId",
  militaryLicenseController.getMilitaryLicenseByVehicleId
);

module.exports = router;