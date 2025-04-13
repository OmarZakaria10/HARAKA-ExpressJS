const Vehicle = require("../models/vehicleModel");
const { Op } = require('sequelize');
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


// Get filtered vehicles with dynamic filtering
exports.getFilteredVehicles = async (req, res) => {
  try {
    const whereClause = {};
    const modelAttributes = Vehicle.getAttributes();
    const validColumns = Object.keys(modelAttributes);
    
    // Process each query parameter
    Object.keys(req.query).forEach(key => {
      // Skip pagination parameters
      if (['page', 'limit', 'sort'].includes(key)) return;
      
      // Check if the parameter matches a valid column
      if (validColumns.includes(key)) {
        const value = req.query[key];
        const attributeType = modelAttributes[key].type;
        // Handle different data types
        switch (modelAttributes[key].type.constructor.name) {
          case 'INTEGER':
            // Handle range queries for numbers
            if (value.includes(',')) {
              const [min, max] = value.split(',').map(Number);
              whereClause[key] = {
                [Op.between]: [min, max]
              };
            } else {
              whereClause[key] = parseInt(value, 10);
            }
            break;
            
          case 'STRING':
          case 'TEXT':
            // Handle multiple values for string fields
            if (value.includes(',')) {
              whereClause[key] = {
                [Op.or]: value.split(',').map(val => ({
                  [Op.iLike]: `%${val.trim()}%`
                }))
              };
            } else {
              whereClause[key] = {
                [Op.iLike]: `%${value}%`
              };
            }
            break;
            
          case 'DATE':
            // Handle date ranges
            if (value.includes(',')) {
              const [start, end] = value.split(',');
              whereClause[key] = {
                [Op.between]: [new Date(start), new Date(end)]
              };
            } else {
              whereClause[key] = new Date(value);
            }
            break;
            
          default:
            whereClause[key] = value;
        }
      }
    });

    // Handle pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Handle sorting
    let order = [['createdAt', 'DESC']];
    if (req.query.sort) {
      const [field, direction] = req.query.sort.split(',');
      if (validColumns.includes(field)) {
        order = [[field, direction.toUpperCase() || 'ASC']];
      }
    }

    // Execute query with all filters
    const vehicles = await Vehicle.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order
    });

    // Send response
    res.status(200).json({
      status: 'success',
      results: vehicles.count,
      currentPage: page,
      totalPages: Math.ceil(vehicles.count / limit),
      filters: whereClause,
      data: {
        vehicles: vehicles.rows
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
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
