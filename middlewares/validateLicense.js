const { sequelize } = require("../config/database");
const License = require("../models/licenseModel");
const Vehicle = require("../models/vehicleModel");
const AppError = require("../utils/appError");
const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
exports.validateLicenseData = catchAsync(async (req, res, next) => {
  const licenseData = { ...req.body };

  // 1. Validate required fields
  const requiredFields = [
    "plate_number",
    "license_type",
    "chassis_number", 
    "license_start_date",
    "license_end_date",
  ];
  const missingFields = requiredFields.filter((field) => !licenseData[field]);

  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing required fields: ${missingFields.join(", ")}`, 400)
    );
  }

  // 2. Validate dates
  if (licenseData.license_start_date && licenseData.license_end_date) {
    const startDate = new Date(licenseData.license_start_date);
    const endDate = new Date(licenseData.license_end_date);
    if (startDate > endDate) {
      return next(new AppError("End date cannot be before start date", 400));
    }
  }

  // 3. If vehicleId is provided, validate vehicle exists
  if (licenseData.vehicleId) {
    const vehicle = await Vehicle.findByPk(licenseData.vehicleId);
    if (!vehicle) {
      return next(new AppError("Vehicle not found with provided ID", 404));
    }

    // 4. Check for duplicate licenses
    const existingLicense = await License.findOne({
      where: {
        [Op.or]: [
          { plate_number: licenseData.plate_number },
          { chassis_number: licenseData.chassis_number },
          { vehicleId: licenseData.vehicleId }
        ]
      }
    });

    if (existingLicense) {
      return next(new AppError("A license already exists for this vehicle/plate number/chassis number", 400));
    }
  } else {
    // 5. If no vehicleId provided, try to find matching vehicle by chassis number
    const vehicle = await Vehicle.findOne({
      where: {
        chassis_number: licenseData.chassis_number
      }
    });
    licenseData.vehicleId = vehicle ? vehicle.id : null;
  }

  req.validatedLicense = licenseData;
  next();
});