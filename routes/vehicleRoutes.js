const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect); // Protect all routes after this middleware
router.get("/getAllVehicles", vehicleController.getAllVehicles);
router.get("/getUniqueFieldValues", vehicleController.getUniqueFieldValues);
router.get("/getVehicle/:id", vehicleController.getVehicleById);
router.use(authController.restrictTo("admin", "user", "GPS", "viewer", "license")); // Restrict all routes to admin, user, vehicle, and viewer roles

router.get(
  "/getVehiclesBySector/:sector",
  vehicleController.getVehiclesBySector
);
router.get(
  "/getVehiclesByPlateNumber",
  vehicleController.getVehicleByPlateNumber
);
router.get(
  "/getVehiclesByAdminstration/:adminstration",
  vehicleController.getVehiclesByAdministration
);

router.use(authController.restrictTo("admin", "user", "GPS", "license"));
router.patch("/updateVehicle/:id", vehicleController.updateVehicle);
router.get("/getFilteredVehicles", vehicleController.getFilteredVehicles);

router.use(authController.restrictTo("admin", "user"));
router.post("/createVehicle", vehicleController.createVehicle);
router.put("/updateInsuranceStatus", vehicleController.updateInsuranceStatus);

router.use(authController.restrictTo("admin"));
router.delete("/deleteVehicle/:id", vehicleController.deleteVehicle);

module.exports = router;
