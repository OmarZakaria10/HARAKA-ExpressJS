# HARAKA-Express - Vehicle & License Management System

A comprehensive system for managing vehicles and their licenses, with user authentication and role-based access control.

## Features

- Complete vehicle management system
- License tracking and validation
- User authentication and authorization
- Role-based access control
- Multiple plate number types support (Malaky, Gesh, Mokhabrat)
- GPS device and line number tracking
- Advanced filtering and search capabilities
- Expiring license notifications
- Full CRUD operations for vehicles, licenses, and users

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication
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
PORT=4000
NODE_ENV=development
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-ultra-secure-secret-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication Routes
- `POST /users/login` - Login with username and password
- `POST /users/logout` - Logout user
- `GET /users/me` - Get current user profile

### User Management (Admin Only)
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user
- `PATCH /users/changePassword` - Change user password (admin only)

### Vehicles
- `GET /vehicles/getAllVehicles` - Get all vehicles
- `GET /vehicles/getVehicle/:id` - Get vehicle by ID
- `GET /vehicles/getFilteredVehicles` - Get filtered vehicles
- `POST /vehicles/createVehicle` - Create a new vehicle
- `PATCH /vehicles/updateVehicle/:id` - Update a vehicle
- `DELETE /vehicles/deleteVehicle/:id` - Delete a vehicle
- `GET /vehicles/getUniqueFieldValues` - Get unique field values for filtering
- `GET /vehicles/getVehiclesBySector/:sector` - Get vehicles by sector
- `GET /vehicles/getVehiclesByAdminstration/:adminstration` - Get vehicles by administration

### Licenses
- `GET /licenses/getAllLicenses` - Get all licenses
- `GET /licenses/getLicenseById/:id` - Get license by ID
- `POST /licenses/createLicense` - Create a new license
- `PATCH /licenses/updateLicense/:id` - Update a license
- `DELETE /licenses/deleteLicense/:id` - Delete a license
- `GET /licenses/getExpiredLicenses` - Get expired licenses
- `GET /licenses/getExpiringLicenses` - Get licenses about to expire
- `GET /licenses/getLicenseByVehicleId/:id` - Get license by vehicle ID
- `GET /licenses/getAllLicensesWithVehicles` - Get all licenses with associated vehicles
- `GET /licenses/getUniqueFieldValues` - Get unique field values for filtering

## Data Models

### User Model
```javascript
{
  id: UUID,
  username: String,
  password: String (hashed),
  role: Enum["admin", "GPS", "license", "viewer", "user"],
  passwordChangedAt: Date,
  active: Boolean
}
```

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

## Authentication & Authorization

### User Roles
- `admin` - Full system access
- `GPS` - GPS-related operations
- `license` - License management
- `viewer` - Read-only access
- `user` - Basic access

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- Secure cookie handling
- Password change tracking
- Account activation status

## Data Validation

### Users
- Username length: 3-50 characters
- Password length: 6-20 characters
- Role validation
- Unique username constraint

### Vehicles
- Unique chassis numbers and plate numbers
- Valid model years
- JSON storage for flexible notes
- Indexed fields for faster queries

### Licenses
- Required fields validation
- Date range validation
- Duplicate license prevention
- Automatic vehicle association
- License validity status tracking
- Real-time expiry calculations

## Error Handling

The API implements comprehensive error handling:
- 404 for resources not found
- 400 for validation errors
- 401 for authentication errors
- 403 for authorization errors
- 500 for server errors
- Custom error messages for operational errors

## Development Features

- Development logging with Morgan
- SQL query logging with formatting
- Environment-based configurations
- CORS support
- Request size limiting
- Static file serving
- Cookie parsing
- Global error handling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.