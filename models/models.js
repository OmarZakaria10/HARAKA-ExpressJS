const Vehicle = require("./vehicleModel");
const License = require("./licenseModel");
const MilitaryLicense = require("./militaryLicenseModel");

// Set up associations between models
const setupAssociations = () => {
  Vehicle.associate({ License, MilitaryLicense });
  License.associate({ Vehicle });
  MilitaryLicense.associate({ Vehicle });
  console.log("Model associations have been established");
};

module.exports = {
  setupAssociations,
  Vehicle,
  License,
  MilitaryLicense,
};
