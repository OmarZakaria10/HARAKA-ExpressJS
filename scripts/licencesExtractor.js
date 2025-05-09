const fs = require("fs");
const csv = require("csv-parser");
const chrono = require("chrono-node");

const results = [];
const INPUT_FILE = "ro5s.csv";
const OUTPUT_FILE = "licenses.json";

// Define the fields to process based on the License model and CSV structure
const FIELDS = [
  "serial_number",
  "plate_number",
  "license_type",
  "vehicle_type",
  "chassis_number",
  "license_start_date",
  "license_end_date",
  "recipient",
  "notes",
  "validity_status",
  "violations",
];

// Helper function to clean and parse date strings
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parsed = chrono.parseDate(dateStr);
  return parsed ? parsed.toISOString().split("T")[0] : null;
};

// Helper function to clean string values
const cleanString = (value) => {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/^"|"$/g, "");
  return cleaned.length > 0 ? cleaned : null;
};

// Map CSV headers to model fields (accounting for Arabic headers)
const HEADER_MAP = {
  //   "م": "serial_number",
  "رقم اللوحة": "plate_number",
  ترخيص: "license_type",
  "نوع العربة": "vehicle_type",
  "رقم الشاسية": "chassis_number",
  "بداية الترخيص": "license_start_date",
  "نهاية الترخيص": "license_end_date",
  "مستلم الرخصة": "recipient",
  ملاحظات: "notes",
  "صلاحية الرخصة": "validity_status",
  مخالفات: "violations",
  "مسلسل بالأرشيف": "serial_number",
};

fs.createReadStream(INPUT_FILE, { encoding: "utf8" })
  .pipe(csv({ separator: "," }))
  .on("headers", (headers) => {
    console.log("CSV Headers:", headers);
  })
  .on("data", (data) => {
    const transformedData = {};

    FIELDS.forEach((field) => {
      // Find the corresponding CSV header
      const csvHeader = Object.keys(HEADER_MAP).find(
        (key) => HEADER_MAP[key] === field
      );
      let value = data[csvHeader];

      if (field === "serial_number") {
        transformedData[field] = value ? Number(value) : null;
      } else if (
        field === "license_start_date" ||
        field === "license_end_date"
      ) {
        transformedData[field] = parseDate(value);
      } else if (field === "violations") {
        transformedData[field] = value && value !== "0" ? value : null;
      } else {
        transformedData[field] = cleanString(value);
      }
    });

    // Only add records with at least a plate_number
    if (transformedData.plate_number) {
      results.push(transformedData);
    }
  })
  .on("end", () => {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf8");
    console.log("✅ Data successfully transformed and saved to licenses.json");
  })
  .on("error", (err) => {
    console.error("❌ Error processing CSV:", err);
  });
