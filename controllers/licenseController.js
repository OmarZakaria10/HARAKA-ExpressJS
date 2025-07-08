const { License, Vehicle } = require("../models/models");
const { Op } = require("sequelize");
const database = require("../config/database");
const catchAsync = require("../utils/catchAsync");
const sequelize = database.getSequelize();

exports.createLicense = catchAsync(async (req, res) => {
  const licenseData = req.validatedLicense;

  const newLicense = await License.create(licenseData);
  if (newLicense.vehicleId) {
    // Update the vehicle's plate_number_malaky to match the license's plate_number
    await Vehicle.update(
      { plate_number_malaky: newLicense.plate_number },
      { where: { id: newLicense.vehicleId } }
    );
  }
  // Fetch the created license with vehicle details
  const licenseWithVehicle = await License.findByPk(newLicense.id, {
    include: [
      {
        model: Vehicle,
        as: "vehicle",
      },
    ],
    order: [["createdAt", "ASC"]],
  });
  res.status(201).json({
    status: "success",
    data: {
      license: licenseWithVehicle,
    },
  });
});

exports.getAllLicenses = catchAsync(async (req, res) => {
  const licenses = await License.findAll({
    order: [["createdAt", "ASC"]],
    attributes: {
      include: ["validity_status"],
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      licenses,
    },
  });
});

exports.getAllLicensesWithVehicles = catchAsync(async (req, res) => {
  const licenses = await License.findAll({
    include: [
      {
        model: Vehicle,
        as: "vehicle",
      },
    ],
    order: [["createdAt", "ASC"]],
  });
  res.status(200).json({
    status: "success",
    data: {
      licenses,
    },
  });
});

// Get license by ID
exports.getLicenseById = catchAsync(async (req, res) => {
  const license = await License.findByPk(req.params.id, {
    include: [
      {
        model: Vehicle,
        as: "vehicle",
      },
    ],
    order: [["createdAt", "ASC"]],
  });
  if (!license) {
    return res.status(404).json({
      status: "fail",
      message: "License not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      license,
    },
  });
});
// Gel license by vehicleId
exports.getLicenseByVehicleId = catchAsync(async (req, res) => {
  const id = req.params.id;
  const license = await License.findOne({
    where: {
      vehicleId: id,
    },
    order: [["createdAt", "ASC"]],
  });
  if (!license) {
    res.status(400).json({
      status: "fail",
      message: "License not found",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    data: license,
  });
});

// Get expiring licenses
exports.getExpiringLicensesBefore = catchAsync(async (req, res) => {
  const { date } = req.query;
  const endDate = new Date(date);
  const expiringLicenses = await License.getExpiringLicensesBefore(endDate);
  res.status(200).json({
    status: "success",
    results: expiringLicenses.length,
    data: {
      licenses: expiringLicenses,
    },
  });
});
// Get expired licenses
exports.getExpiredLicenses = catchAsync(async (req, res) => {
  const expiredLicenses = await License.getExpiredLicenses();
  res.status(200).json({
    status: "success",
    results: expiredLicenses.length,
    data: {
      licenses: expiredLicenses,
    },
  });
});
// Update license
exports.updateLicense = catchAsync(async (req, res) => {
  const [updated] = await License.update(req.body, {
    where: { id: req.params.id },
  });
  if (!updated) {
    return res.status(404).json({
      status: "fail",
      message: "License not found",
    });
  }
  const updatedLicense = await License.findByPk(req.params.id, {
    include: [
      {
        model: Vehicle,
        as: "vehicle",
      },
    ],
    order: [["createdAt", "ASC"]],
  });
  res.status(200).json({
    status: "success",
    data: {
      license: updatedLicense,
    },
  });
});
// Delete license
exports.deleteLicense = catchAsync(async (req, res) => {
  const deleted = await License.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({
      status: "fail",
      message: "License not found",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// Get unique field values for filtering
exports.getUniqueFieldValues = catchAsync(async (req, res) => {
  const { fields } = { ...req.query };
  if (!fields) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify fields to get unique values",
    });
  }
  const fieldArray = fields.split(",");
  const results = {};
  await Promise.all(
    fieldArray.map(async (field) => {
      const values = await License.findAll({
        attributes: [[sequelize.fn("DISTINCT", sequelize.col(field)), field]],
        where: {
          [field]: {
            [Op.not]: null,
          },
        },
        order: [[field, "ASC"]],
      });
      results[field] = values.map((item) => item[field]).filter(Boolean);
    })
  );
  res.status(200).json({
    status: "success",
    data: results,
  });
});
