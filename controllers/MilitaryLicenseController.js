const { MilitaryLicense, Vehicle } = require("../models/models");
const { Op } = require("sequelize");
const database = require("../config/database");
const catchAsync = require("../utils/catchAsync");
const sequelize = database.getSequelize();

exports.getAllMilitaryLicenses = catchAsync(async (req, res) => {
  const militaryLicenses = await MilitaryLicense.findAll({
    order: [["createdAt", "ASC"]],
  });

  res.status(200).json({
    status: "success",
    results: militaryLicenses.length,
    data: {
      militaryLicenses,
    },
  });
});

exports.createMilitaryLicense = catchAsync(async (req, res) => {
  const militaryLicenseData = { ...req.body };
  if (!militaryLicenseData.vehicleId) {
    const vehicle = await Vehicle.findOne({
      where: {
        chassis_number: {
          [Op.iLike]: `%${militaryLicenseData.chassis_number}`,
        },
      },
    });
    if (vehicle) {
      militaryLicenseData.vehicleId = vehicle.id;
      militaryLicenseData.chassis_number = vehicle.chassis_number;
      if (vehicle.plate_number_gesh === null) {
        vehicle.plate_number_gesh = militaryLicenseData.plate_number_gesh;
      }
      await vehicle.save();
    }
  }
  const newMilitaryLicense = await MilitaryLicense.create(militaryLicenseData);

  res.status(201).json({
    status: "success",
    data: {
      militaryLicense: newMilitaryLicense,
    },
  });
});

exports.updateMilitaryLicense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const militaryLicenseData = { ...req.body };
  if (!militaryLicenseData.vehicleId) {
    const vehicle = await Vehicle.findOne({
      where: {
        chassis_number: {
          [Op.iLike]: `%${militaryLicenseData.chassis_number}`,
        },
      },
    });
    if (vehicle) {
      militaryLicenseData.vehicleId = vehicle.id;
      militaryLicenseData.chassis_number = vehicle.chassis_number;
      vehicle.plate_number_gesh = militaryLicenseData.plate_number_gesh;
      console.log("Vehicle found:", vehicle);
      await vehicle.save();
    }
  } else {
    const vehicle = await Vehicle.findByPk(militaryLicenseData.vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        status: "fail",
        message: "Vehicle not found with the provided ID",
      });
    }
    militaryLicenseData.chassis_number = vehicle.chassis_number;
    vehicle.plate_number_gesh = militaryLicenseData.plate_number_gesh;
    await vehicle.save();
  }
  const updatedMilitaryLicense = await MilitaryLicense.update(
    militaryLicenseData,
    {
      where: {
        id,
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      militaryLicense: updatedMilitaryLicense,
    },
  });
});

exports.deleteMilitaryLicense = catchAsync(async (req, res) => {
  const { id } = req.params;
  await MilitaryLicense.destroy({
    where: {
      id,
    },
  });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMilitaryLicenseById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const militaryLicense = await MilitaryLicense.findByPk(id, {
    order: [["createdAt", "ASC"]],
  });
  if (!militaryLicense) {
    return res.status(404).json({
      status: "fail",
      message: "Military License not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      militaryLicense,
    },
  });
});

exports.getMilitaryLicenseByChassisNumber = catchAsync(async (req, res) => {
  const { chassis_number } = req.params;
  const militaryLicense = await MilitaryLicense.findOne({
    where: {
      chassis_number: {
        [Op.iLike]: `%${chassis_number}`,
      },
    },
    order: [["createdAt", "ASC"]],
  });
});

exports.getMilitaryLicenseByVehicleId = catchAsync(async (req, res) => {
  const { vehicleId } = req.params;
  const militaryLicense = await MilitaryLicense.findOne({
    where: {
      vehicleId: vehicleId,
    },
    order: [["createdAt", "ASC"]],
  });

  if (!militaryLicense) {
    return res.status(404).json({
      status: "fail",
      message: "No military license found with this vehicle ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      militaryLicense,
    },
  });
});

exports.getUniqueMilitaryFieldValues = catchAsync(async (req, res) => {
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
      const values = await MilitaryLicense.findAll({
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
