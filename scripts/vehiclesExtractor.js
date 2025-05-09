const fs = require("fs");
const csv = require("csv-parser");

const results = [];
const INPUT_FILE = "data2.csv";
const OUTPUT_FILE = "records2.json";

// Define the fields we want to process
const FIELDS = [
  "code",
  "chassis_number",
  "vehicle_type",
  "vehicle_equipment",
  "plate_number_mokhabrat",
  "plate_number_gesh",
  "plate_number_malaky",
  "engine_number",
  "color",
  "gps_device_number",
  "line_number",
  "sector",
  "model_year",
  "fuel_type",
  "administration",
  "responsible_person",
  "supply_source",
  "insurance_status",
  "notes",
];

fs.createReadStream(INPUT_FILE, { encoding: "utf8" })
  .pipe(csv({ separator: "," }))
  .on("headers", (headers) => {
    console.log("CSV Headers:", headers);
  })
  .on("data", (data) => {
    const transformedData = {};
    FIELDS.forEach((field) => {
      if (field === 'model_year') {
        transformedData[field] = data[field] ? Number(data[field]) : null;
      } else {
        transformedData[field] = data[field] || null;
      }
    });
    results.push(transformedData);
  })
  .on("end", () => {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf8");
    console.log("✅ Data successfully transformed and saved.");
  });
