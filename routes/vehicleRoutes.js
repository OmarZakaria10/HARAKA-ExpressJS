const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const router = express.Router();
const Vehicle = require("../models/vehicleModel");

router.post("/createVehicle", vehicleController.createVehicle);
router.get("/getAllVehicles", vehicleController.getAllVehicles);
router.get("/getVehicle/:id", vehicleController.getVehicleById);
router.get("/getFilteredVehicles", vehicleController.getFilteredVehicles);
router.patch("/updateVehicle/:id", vehicleController.updateVehicle);
router.delete("/deleteVehicle/:id", vehicleController.deleteVehicle);
router.get("/getUniqueFieldValues", vehicleController.getUniqueFieldValues);

module.exports = router;
