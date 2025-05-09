const fs = require("fs");

const LICENSES_FILE = "test.json";
const VEHICLES_FILE = "vehicles.json";

// Read JSON files
const licenses = JSON.parse(fs.readFileSync(LICENSES_FILE, "utf8"));
const vehicles = JSON.parse(fs.readFileSync(VEHICLES_FILE, "utf8"));

licenses.forEach((license) => {
  const match = vehicles.find((vehicle) =>
    vehicle.chassis_number?.includes(license.chassis_number)
  );
  console.log(match);
  license.vehicleId = match ? match.id : null;
});

fs.writeFileSync("test.json", JSON.stringify(licenses, null, 2));
