const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const router = express.Router();
const Vehicle = require("../models/vehicleModel");

router.post("/createVehicle", vehicleController.createVehicle);
router.get("/getAllVheicles", vehicleController.getAllVehicles);
router.get("/getVehicle/:id", vehicleController.getVehicleById);
// router.get('/getFillteredVehicles',)
router.patch("/updateVehicle/:id", vehicleController.updateVehicle);
router.delete("/deleteVehicle/:id", vehicleController.deleteVehicle);

module.exports = router;
