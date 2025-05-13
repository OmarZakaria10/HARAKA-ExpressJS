const { License, Vehicle } = require("../models/models");
const { Op } = require("sequelize");
const database = require("../config/database");
const sequelize = database.getSequelize();

exports.createLicense = async (req, res) => {
  try {
    const licenseData = req.validatedLicense;
    // console.log(licenseData);
    const newLicense = await License.create(licenseData);
    // Fetch the created license with vehicle details
    const licenseWithVehicle = await License.findByPk(newLicense.id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
      ],
    });
    res.status(201).json({
      status: "success",
      data: {
        license: licenseWithVehicle,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAllLicenses = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAllLicensesWithVehicles = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get license by ID
exports.getLicenseById = async (req, res) => {
  try {
    const license = await License.findByPk(req.params.id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
      ],
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
// Gel license by vehicleId
exports.getLicenseByVehicleId = async (req, res) => {
  const id = req.params.id;
  try {
    const license = await License.findOne({
      where: {
        vehicleId: id,
      },
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get expiring licenses
exports.getExpiringLicenses = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const expiringLicenses = await License.getExpiringLicenses(parseInt(days));

    res.status(200).json({
      status: "success",
      results: expiringLicenses.length,
      data: {
        licenses: expiringLicenses,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
// Get expired licenses
exports.getExpiredLicenses = async (req, res) => {
  try {
    const expiredLicenses = await License.getExpiredLicenses();

    res.status(200).json({
      status: "success",
      results: expiredLicenses.length,
      data: {
        licenses: expiredLicenses,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
// Update license
exports.updateLicense = async (req, res) => {
  try {
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
    });

    res.status(200).json({
      status: "success",
      data: {
        license: updatedLicense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};
// Delete license
exports.deleteLicense = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
// Get unique field values for filtering
exports.getUniqueFieldValues = async (req, res) => {
  try {
    const fields = { ...req.query };

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
        });
        results[field] = values.map((item) => item[field]).filter(Boolean);
      })
    );

    res.status(200).json({
      status: "success",
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
