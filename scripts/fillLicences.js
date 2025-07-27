const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Define the API URL
const API_URL = "http://localhost:8080/licences/createLicence";

// Path to the JSON file
const JSON_FILE = path.join(__dirname, "test.json");
const failed = [];
// Function to send a POST request for each object in the JSON file
async function sendLicencesData() {
  try {
    // Read the JSON file
    const data = fs.readFileSync(JSON_FILE, "utf8");
    const licences = JSON.parse(data);

    // Iterate through each licence object and send a POST request
    for (const licence of licences) {
      try {
        // Convert model_year to integer if it's not NULL

        const response = await axios.post(API_URL, licence, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("✅ Response from API:", response.data); // Log the API response
      } catch (error) {
        console.error(
          "❌ Error sending licence:",
          licence.code,
          "| Status:",
          error.response?.status || "Unknown",
          "| Message:",
          error.response?.data || error.message
        );

        failed.push(licence);
      }
    }
  } catch (error) {
    console.error("Error reading the JSON file:", error.message);
  }
  console.log(failed.length);
}

// Execute the function
sendLicencesData();
