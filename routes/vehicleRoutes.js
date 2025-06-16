const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const authController = require('../controllers/authController');
const router = express.Router();
const Vehicle = require("../models/vehicleModel");

router.use(authController.protect); // Protect all routes after this middleware
router.use(authController.restrictTo('admin','user','GPS','viewer')); // Restrict all routes to admin, user, vehicle, and viewer roles
router.get("/getUniqueFieldValues", vehicleController.getUniqueFieldValues);
router.get("/getAllVehicles", vehicleController.getAllVehicles);
router.get("/getVehicle/:id", vehicleController.getVehicleById);
router.get("/getFilteredVehicles", vehicleController.getFilteredVehicles);
router.get("/getVehiclesBySector/:sector", vehicleController.getVehiclesBySector);
router.get("/getVehiclesByAdminstration/:adminstration", vehicleController.getVehiclesByAdministration);

router.use(authController.restrictTo('admin','user','GPS')); 
router.post("/createVehicle", vehicleController.createVehicle);
router.patch("/updateVehicle/:id", vehicleController.updateVehicle);

router.use(authController.restrictTo('admin','user',)); 
router.delete("/deleteVehicle/:id", vehicleController.deleteVehicle);


module.exports = router;
