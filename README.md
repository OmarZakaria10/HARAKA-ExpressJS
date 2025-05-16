# HARAKA-Express - Vehicle & License Management System

A comprehensive system for managing vehicles and their licenses, built with Node.js, Express, and Sequelize.

## Features

- Complete vehicle management system
- License tracking and validation
- Multiple plate number types support (Malaky, Gesh, Mokhabrat)
- GPS device and line number tracking
- Advanced filtering and search capabilities
- Expiring license notifications
- Full CRUD operations for both vehicles and licenses

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- REST API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HARAKA-Express
```

2. Install dependencies:
```bash
npm install
```

3. Create a `config.env` file in the root directory:
```env
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
PORT=8080
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Vehicles
- `GET /vehicles/getAllVehicles` - Get all vehicles
- `GET /vehicles/getVehicle/:id` - Get vehicle by ID
- `GET /vehicles/getFilteredVehicles` - Get filtered vehicles
- `POST /vehicles/createVehicle` - Create a new vehicle
- `PATCH /vehicles/updateVehicle/:id` - Update a vehicle
- `DELETE /vehicles/deleteVehicle/:id` - Delete a vehicle
- `GET /vehicles/getUniqueFieldValues` - Get unique field values for filtering

### Licenses
- `GET /licenses/getAllLicenses` - Get all licenses
- `GET /licenses/getLicenseById/:id` - Get license by ID
- `POST /licenses/createLicense` - Create a new license
- `PATCH /licenses/updateLicense/:id` - Update a license
- `DELETE /licenses/deleteLicense/:id` - Delete a license
- `GET /licenses/getExpiredLicenses` - Get expired licenses
- `GET /licenses/getExpiringLicenses` - Get licenses about to expire
- `GET /licenses/getLicenseByVehicleId/:id` - Get license by vehicle ID

## Data Models

### Vehicle Model
```javascript
{
  id: UUID,
  code: String,
  chassis_number: String,
  vehicle_type: String,
  vehicle_equipment: String,
  plate_number_malaky: String,
  plate_number_gesh: String,
  plate_number_mokhabrat: String,
  engine_number: String,
  color: String,
  gps_device_number: String,
  line_number: String,
  sector: String,
  model_year: Integer,
  fuel_type: String,
  administration: String,
  responsible_person: String,
  supply_source: String,
  insurance_status: String,
  notes: JSON
}
```

### License Model
```javascript
{
  id: UUID,
  serial_number: Integer,
  plate_number: String,
  license_type: String,
  vehicle_type: String,
  chassis_number: String,
  license_start_date: Date,
  license_end_date: Date,
  recipient: String,
  notes: Text,
  violations: Text,
  vehicleId: UUID,
  validity_status: Virtual
}
```

## Data Validation

### Vehicles
- Unique chassis numbers and plate numbers
- Valid model years
- JSON storage for flexible notes

### Licenses
- Required fields validation
- Date range validation
- Duplicate license prevention
- Automatic vehicle association
- License validity status tracking

## Error Handling

The API implements comprehensive error handling:
- 404 for resources not found
- 400 for validation errors
- 500 for server errors
- Custom error messages for operational errors

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.