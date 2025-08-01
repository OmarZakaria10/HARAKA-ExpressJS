const Vehicle = require("../models/vehicleModel");
const { Op } = require("sequelize");
const database = require("../config/database");
const catchAsync = require("../utils/catchAsync");
const sequelize = database.getSequelize();
const vehiclesRoleColumns = require("../config/vehiclesRoleColumns");

// Helper function to get attributes based on user role
const getRoleAttributes = (userRole) => {
  // console.log(vehiclesRoleColumns[userRole]);
  // console.log("user: ", vehiclesRoleColumns["user"]);
  return vehiclesRoleColumns[userRole] || vehiclesRoleColumns["user"];
};

exports.getAllVehicles = catchAsync(async (req, res) => {
  // console.log(req.user.role);
  const vehicles = await Vehicle.findAll({
    attributes: getRoleAttributes(req.user.role),
    order: [["createdAt", "ASC"]],
  });
  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

// Get filtered vehicles with dynamic filtering
exports.getFilteredVehicles = catchAsync(async (req, res) => {
  const whereClause = {};
  const modelAttributes = Vehicle.getAttributes();
  const validColumns = Object.keys(modelAttributes);
  const roleAttributes = getRoleAttributes(req.user.role);

  // Process each query parameter
  Object.keys(req.query).forEach((key) => {
    // Skip pagination parameters
    if (["page", "limit", "sort"].includes(key)) return;

    // Check if the parameter matches a valid column
    if (validColumns.includes(key)) {
      const value = req.query[key];
      const attributeType = modelAttributes[key].type;
      // Handle different data types
      switch (modelAttributes[key].type.constructor.name) {
        case "INTEGER":
          // Handle range queries for numbers
          if (value.includes(",")) {
            const [min, max] = value.split(",").map(Number);
            whereClause[key] = {
              [Op.between]: [min, max],
            };
          } else {
            whereClause[key] = parseInt(value, 10);
          }
          break;

        case "STRING":
        case "TEXT":
          // Handle multiple values for string fields
          if (value.includes(",")) {
            whereClause[key] = {
              [Op.or]: value.split(",").map((val) => ({
                [Op.iLike]: `%${val.trim()}%`,
              })),
            };
          } else {
            whereClause[key] = {
              [Op.iLike]: `%${value}%`,
            };
          }
          break;
        case "DATE":
          // Handle date ranges
          if (value.includes(",")) {
            const [start, end] = value.split(",");
            whereClause[key] = {
              [Op.between]: [new Date(start), new Date(end)],
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
  const limit = parseInt(req.query.limit, 10) || 500;
  const offset = (page - 1) * limit;

  // Handle sorting
  let order = [["createdAt", "DESC"]];
  if (req.query.sort) {
    const [field, direction] = req.query.sort.split(",");
    if (validColumns.includes(field)) {
      order = [[field, direction.toUpperCase() || "ASC"]];
    }
  }

  // Execute query with all filters and role-based attributes
  const vehicles = await Vehicle.findAndCountAll({
    attributes: roleAttributes,
    where: whereClause,
    limit,
    offset,
    order: [["createdAt", "ASC"]],
  });

  // Send response
  res.status(200).json({
    status: "success",
    results: vehicles.count,
    currentPage: page,
    totalPages: Math.ceil(vehicles.count / limit),
    filters: whereClause,
    data: {
      vehicles: vehicles.rows,
    },
  });
});

// Get a single vehicle by ID
exports.getVehicleById = catchAsync(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id, {
    attributes: getRoleAttributes(req.user.role),
    order: [["createdAt", "ASC"]],
  });
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
});

exports.getVehicleByChassisNumber = catchAsync(async (req, res) => {
  const { chassis_number } = req.params;
  const vehicle = await Vehicle.findOne({
    attributes: getRoleAttributes(req.user.role),
    where: {
      chassis_number: {
        [Op.iLike]: `%${chassis_number}%`,
      },
    },
    order: [["createdAt", "ASC"]],
  });

  if (!vehicle) {
    return res.status(404).json({
      status: "fail",
      message: "No vehicle found with this chassis number",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

// Create a new vehicle
exports.createVehicle = catchAsync(async (req, res) => {
  const vehicleData = { ...req.body };
  if (vehicleData.modelYear) {
    vehicleData.modelYear =
      vehicleData.modelYear === "NULL"
        ? null
        : parseInt(vehicleData.modelYear, 10);
  }
  const newVehicle = await Vehicle.create(vehicleData);

  // Fetch the created vehicle with role-based attributes
  const vehicleWithRoleAttributes = await Vehicle.findByPk(newVehicle.id, {
    attributes: getRoleAttributes(req.user.role),
    order: [["createdAt", "ASC"]],
  });

  res.status(201).json({
    status: "success",
    data: {
      vehicle: vehicleWithRoleAttributes,
    },
  });
});

// Update a vehicle by ID
exports.updateVehicle = catchAsync(async (req, res) => {
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
  const updatedVehicle = await Vehicle.findByPk(req.params.id, {
    attributes: getRoleAttributes(req.user.role),
    order: [["createdAt", "ASC"]],
  });
  res.status(200).json({
    status: "success",
    data: {
      vehicle: updatedVehicle,
    },
  });
});

// Delete a vehicle by ID
exports.deleteVehicle = catchAsync(async (req, res) => {
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
});
exports.getUniqueFieldValues = catchAsync(async (req, res) => {
  const { fields } = req.query; // Expect fields as comma-separated string
  if (!fields) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify fields to get unique values",
    });
  }
  const fieldArray = fields.split(",");
  const results = {};
  // Get unique values for each requested field (no constraints)
  await Promise.all(
    fieldArray.map(async (field) => {
      const uniqueValues = await Vehicle.findAll({
        attributes: [[sequelize.fn("DISTINCT", sequelize.col(field)), field]],
        where: {
          [field]: {
            [Op.not]: null, // Exclude null values
          },
        },
        order: [[field, "ASC"]],
      });
      results[field] = uniqueValues.map((item) => item[field]).filter(Boolean);
    })
  );
  res.status(200).json({
    status: "success",
    data: results,
  });
});
exports.getVehiclesBySector = catchAsync(async (req, res) => {
  const { sector } = req.params;
  const vehicles = await Vehicle.findAll({
    attributes: getRoleAttributes(req.user.role),
    where: {
      sector: {
        [Op.eq]: `${sector}`,
      },
    },
    order: [["createdAt", "ASC"]],
  });

  if (vehicles.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No vehicles found for this sector",
    });
  }

  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

exports.getVehiclesByAdministration = catchAsync(async (req, res) => {
  const { administration } = req.params;
  const vehicles = await Vehicle.findAll({
    attributes: getRoleAttributes(req.user.role),
    where: {
      administration: {
        [Op.eq]: `${administration}`,
      },
    },
    order: [["createdAt", "ASC"]],
  });

  if (vehicles.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No vehicles found for this administration",
    });
  }

  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});
