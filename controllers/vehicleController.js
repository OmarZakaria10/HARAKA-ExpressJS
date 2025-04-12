const Vehicle = require("../models/vehicleModel");

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json({
      status: "success",
      results: vehicles.length,
      data: {
        vehicles,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        status: "fail",
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        vehicle,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const vehicleData = { ...req.body };
    if (vehicleData.modelYear) {
      vehicleData.modelYear =
        vehicleData.modelYear === "NULL"
          ? null
          : parseInt(vehicleData.modelYear, 10);
    }
    const newVehicle = await Vehicle.create(vehicleData);
    res.status(201).json({
      status: "success",
      data: {
        vehicle: newVehicle,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

// Update a vehicle by ID
exports.updateVehicle = async (req, res) => {
  try {
    const vehicleData = { ...req.body };
    if (vehicleData.modelYear) {
      vehicleData.modelYear =
        vehicleData.modelYear === "NULL"
          ? null
          : parseInt(vehicleData.modelYear, 10);
    }
    const [updated] = await Vehicle.update(vehicleData, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Vehicle not found",
      });
    }
    const updatedVehicle = await Vehicle.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        vehicle: updatedVehicle,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

// Delete a vehicle by ID
exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Vehicle not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
