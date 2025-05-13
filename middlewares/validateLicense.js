const { sequelize } = require("../config/database");
const License = require("../models/licenseModel");
const Vehicle = require("../models/vehicleModel");
const AppError = require("../utils/appError");
const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");

exports.validateLicenseData = catchAsync(async (req, res, next) => {
  const licenseData = { ...req.body };

  const requiredFields = [
    "plate_number",
    "license_type",
    "chassis_number",
    "license_start_date",
    "license_end_date",
  ];
  const missingFields = requiredFields.filter((field) => !licenseData[field]);

  if (missingFields.length > 0)
    return next(
      new AppError(`Missing required fields: ${missingFields.join(", ")}`, 400)
    );
  if (licenseData.license_start_date && licenseData.license_end_date) {
    const startDate = new Date(licenseData.license_start_date);
    const endDate = new Date(licenseData.license_end_date);
    if (startDate > endDate)
      return next(new AppError("End date cannot be before start date", 400));
  }
  if (licenseData.vehicleId) {
    const vehicle = await Vehicle.findByPk(licenseData.vehicleId);
    if (!vehicle) return next(new AppError("No vehicles with that Id", 404));

    const existingLicense = await License.findOne({
      where: {
        [Op.not]: [{ id: licenseData.id }],
        [Op.or]: [
          { plate_number: licenseData.plate_number },
          { chassis_number: licenseData.chassis_number },
          { vehicleId: licenseData.vehicleId },
        ],
      },
    });
    if (existingLicense)
      return next(new AppError("Licenses data conflict"), 400);
    if (!licenseData.vehicleId) {
      const vehicle = await Vehicle.findOne({
        attributes: ["id"],
        where: {
          chassis_number: {
            [Op.substring]: licenseData.chassis_number,
          },
        },
      });
      // console.log(vehicle);
      licenseData.vehicleId = vehicle ? vehicle.id : null;
    }
  }
  req.validatedLicense = licenseData;
  // console.log(licenseData);
  next();
});
