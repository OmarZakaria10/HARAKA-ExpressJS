const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Define the API URL
const API_URL = "http://localhost:3000/vehicles/createVehicle";

// Path to the JSON file
const JSON_FILE = path.join(__dirname, "records.json");

// Function to send a POST request for each object in the JSON file
async function sendVehiclesData() {
  try {
    // Read the JSON file
    const data = fs.readFileSync(JSON_FILE, "utf8");
    const vehicles = JSON.parse(data);

    // Iterate through each vehicle object and send a POST request
    for (const vehicle of vehicles) {
      try {
        // Convert model_year to integer if it's not NULL

        const response = await axios.post(API_URL, vehicle, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("✅ Response from API:", response.data); // Log the API response
      } catch (error) {
        console.error(
          "❌ Error sending vehicle:",
          vehicle.code,
          "| Status:",
          error.response?.status || "Unknown",
          "| Message:",
          error.response?.data || error.message
        );
      }
    }
  } catch (error) {
    console.error("Error reading the JSON file:", error.message);
  }
}

// Execute the function
sendVehiclesData();
