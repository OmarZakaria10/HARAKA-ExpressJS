const Vehicle = require('./vehicleModel');
const License = require('./licenseModel');

// Set up associations between models
const setupAssociations = () => {
  // Call associate methods on each model to establish relationships
  Vehicle.associate({ License });
  License.associate({ Vehicle });
  
  console.log('Model associations have been established');
};

module.exports = {
  setupAssociations,
  Vehicle,
  License
};