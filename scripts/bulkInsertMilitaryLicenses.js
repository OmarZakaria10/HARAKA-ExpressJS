const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const militaryLicenseModel = require('../models/militaryLicenseModel');
const database = require('../config/database');

// Path to your JSON file (update this if needed)
const jsonFilePath = path.join(__dirname, 'licenses.json');

async function bulkInsertMilitaryLicenses() {
  try {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of objects');
    }

    // Insert data in bulk
    await militaryLicenseModel.bulkCreate(data, { ignoreDuplicates: true });
    console.log('Bulk insert completed successfully.');
  } catch (error) {
    console.error('Error during bulk insert:', error);
  } finally {
    // Close the database connection
    await database.getSequelize().close();
  }
}

bulkInsertMilitaryLicenses();
