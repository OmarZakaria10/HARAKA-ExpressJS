const Vehicle = require('../models/vehicleModel');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json({
            status: 'success',
            results: vehicles.length,
            data: {
                vehicles,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                status: 'fail',
                message: 'Vehicle not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                vehicle,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const newVehicle = await Vehicle.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                vehicle: newVehicle,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
        });
    }
};

// Update a vehicle by ID
exports.updateVehicle = async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedVehicle) {
            return res.status(404).json({
                status: 'fail',
                message: 'Vehicle not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                vehicle: updatedVehicle,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message,
        });
    }
};

// Delete a vehicle by ID
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                status: 'fail',
                message: 'Vehicle not found',
            });
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};