# 🚗 HARAKA-Express

<div align="center">
  <p><strong>A comprehensive Vehicle & License Management System</strong></p>
  
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)](https://nodejs.org/)
</div>

---

## 📋 Table of Contents

- [🚗 HARAKA-Express](#-haraka-express)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🚀 Quick Start](#-quick-start)
  - [⚙️ Installation](#️-installation)
  - [🌍 Environment Variables](#-environment-variables)
  - [📁 Project Structure](#-project-structure)
  - [🔗 API Documentation](#-api-documentation)
    - [🔐 Authentication Routes](#-authentication-routes)
    - [👥 User Management](#-user-management)
    - [🚙 Vehicle Management](#-vehicle-management)
    - [📄 License Management](#-license-management)
    - [🪖 Military License Management](#-military-license-management)
  - [📊 Data Models](#-data-models)
    - [👤 User Model](#-user-model)
    - [🚗 Vehicle Model](#-vehicle-model)
    - [📋 License Model](#-license-model)
    - [🪖 Military License Model](#-military-license-model)
  - [🔐 Authentication & Authorization](#-authentication--authorization)
    - [👥 User Roles](#-user-roles)
    - [🔒 Security Features](#-security-features)
  - [✅ Data Validation](#-data-validation)
  - [⚠️ Error Handling](#️-error-handling)
  - [� Data Migration & DevOps](#-data-migration--devops)
  - [�🐳 Docker Deployment](#-docker-deployment)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

---

## ✨ Features

- 🚗 **Complete Vehicle Management** - Full CRUD operations for vehicle records
- 📋 **License Tracking** - Comprehensive license validation and management
- 🔐 **User Authentication** - Secure JWT-based authentication system
- 👥 **Role-Based Access Control** - Multi-level user permissions
- 🏷️ **Multiple Plate Types** - Support for Malaky, Gesh, and Mokhabrat plates
- 📍 **GPS Integration** - Device and line number tracking
- 🔍 **Advanced Search** - Powerful filtering and search capabilities
- ⏰ **Expiry Notifications** - Automatic license expiration tracking
- 🪖 **Military License Support** - Specialized military license management
- 📊 **Data Export** - Excel export functionality
- 🌐 **RESTful API** - Well-structured REST endpoints
- 📁 **CSV Data Migration** - Import data from CSV files with validation
- 🏗️ **CI/CD Pipeline** - Jenkins integration for automated deployments
- 🔄 **Database Backup & Restore** - Automated backup scripts
- 🛡️ **Enhanced Security** - XSS protection, Helmet security headers
- 📱 **Frontend Integration** - React frontend build integration
- 🗄️ **Insurance Management** - Track insurance policies and documents
- 🚢 **Customs Clearance** - Manage customs clearance documentation
- 📝 **Enhanced Notes System** - JSON-based notes for flexible data storage

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **Sequelize** | ORM for database operations |
| **PostgreSQL** | Primary database |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Morgan** | HTTP request logging |
| **CORS** | Cross-origin resource sharing |
| **ExcelJS** | Excel file generation |
| **Docker** | Containerization |
| **Helmet** | Security middleware |
| **XSS-Clean** | XSS attack prevention |
| **Chalk** | Terminal string styling |
| **Validator** | Data validation |
| **CSV-Parser** | CSV file processing |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/HARAKA-Express.git
cd HARAKA-Express

# Install dependencies
npm install

# Set up environment variables
cp example.config.env config.env
# Edit config.env with your database credentials

# Start development server
npm run dev
```

---

## ⚙️ Installation

### Prerequisites

- Node.js (v16.0.0 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Step-by-step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/HARAKA-Express.git
   cd HARAKA-Express
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   ```bash
   # Create PostgreSQL database
   createdb haraka_express
   
   # Or using psql
   psql -U postgres -c "CREATE DATABASE haraka_express;"
   ```

4. **Environment Configuration:**
   ```bash
   cp example.config.env config.env
   ```
   Edit the `config.env` file with your configuration.

5. **Start the application:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

---

## 🌍 Environment Variables

Create a `config.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_NAME=haraka_express
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# For cloud deployment (optional)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your-ultra-secure-secret-key-minimum-32-characters
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# CORS Configuration (optional)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

## 📁 Project Structure

```
HARAKA-Express/
├── 📁 config/
│   ├── database.js               # Database configuration & connection
│   └── vehiclesRoleColumns.js    # Role-based column access control
├── 📁 controllers/
│   ├── authController.js         # Authentication & authorization
│   ├── errorController.js        # Global error handling
│   ├── userController.js         # User management operations
│   ├── vehicleController.js      # Vehicle CRUD operations
│   ├── licenseController.js      # License management
│   └── MilitaryLicenseController.js # Military license operations
├── 📁 models/
│   ├── models.js                 # Model associations setup
│   ├── userModel.js              # User data model
│   ├── vehicleModel.js           # Vehicle data model
│   ├── licenseModel.js           # License data model
│   └── militaryLicenseModel.js   # Military license model
├── 📁 routes/
│   ├── userRoutes.js             # User API endpoints
│   ├── vehicleRoutes.js          # Vehicle API endpoints
│   ├── licenseRoutes.js          # License API endpoints
│   └── militaryLicenseRoutes.js  # Military license endpoints
├── 📁 middlewares/
│   └── validateLicense.js        # License validation middleware
├── 📁 utils/
│   ├── appError.js               # Custom error handling
│   ├── catchAsync.js             # Async error wrapper
│   └── responseHandler.js        # Standardized API responses
├── 📁 dataMigration/
│   ├── convertCsvToJson.js       # CSV data conversion utilities
│   ├── csv-to-json-converter.js  # Advanced CSV converter
│   ├── csv-to-license-converter.js # License data converter
│   ├── import-*.js               # Production data import scripts
│   └── link-vehicles-licenses.js # Data linking utilities
├── 📁 scripts/
│   ├── backupAndRestore.sh       # Database backup automation
│   ├── bulkInsertMilitaryLicenses.js # Bulk data operations
│   ├── fillDB.js                 # Database seeding
│   └── uploadToAiven.sh          # Cloud deployment script
├── 📁 build/                     # React frontend build files
├── 📁 logs/                      # Application logs
├── app.js                        # Express app configuration
├── index.js                      # Application entry point
├── healthcheck.js                # Docker health check
├── Jenkinsfile                   # CI/CD pipeline configuration
├── dockerfile                    # Docker container setup
├── docker-compose.yml            # Multi-container setup
├── package.json                  # Dependencies & scripts
└── README.md                     # Project documentation
```

---

## 🔗 API Documentation

### 🔐 Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/users/login` | User login | ❌ |
| `POST` | `/users/logout` | User logout | ✅ |
| `GET` | `/users/me` | Get current user profile | ✅ |

### 👥 User Management
*Admin access required*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `POST` | `/users` | Create new user |
| `GET` | `/users/:id` | Get user by ID |
| `PATCH` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Soft delete user |
| `PATCH` | `/users/changePassword` | Change user password |

### 🚙 Vehicle Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/vehicles/getAllVehicles` | Get all vehicles |
| `GET` | `/vehicles/getVehicle/:id` | Get vehicle by ID |
| `GET` | `/vehicles/getFilteredVehicles` | Get filtered vehicles |
| `POST` | `/vehicles/createVehicle` | Create new vehicle |
| `PATCH` | `/vehicles/updateVehicle/:id` | Update vehicle |
| `DELETE` | `/vehicles/deleteVehicle/:id` | Delete vehicle |
| `GET` | `/vehicles/getUniqueFieldValues` | Get unique field values |
| `GET` | `/vehicles/getVehiclesBySector/:sector` | Get vehicles by sector |
| `GET` | `/vehicles/getVehiclesByAdminstration/:adminstration` | Get vehicles by administration |

### 📄 License Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/licenses/getAllLicenses` | Get all licenses |
| `GET` | `/licenses/getLicenseById/:id` | Get license by ID |
| `POST` | `/licenses/createLicense` | Create new license |
| `PATCH` | `/licenses/updateLicense/:id` | Update license |
| `DELETE` | `/licenses/deleteLicense/:id` | Delete license |
| `GET` | `/licenses/getExpiredLicenses` | Get expired licenses |
| `GET` | `/licenses/getExpiringLicenses` | Get expiring licenses |
| `GET` | `/licenses/getLicenseByVehicleId/:id` | Get license by vehicle ID |
| `GET` | `/licenses/getAllLicensesWithVehicles` | Get licenses with vehicles |

### 🪖 Military License Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/military-licenses/getAllMilitaryLicenses` | Get all military licenses |
| `POST` | `/military-licenses/createMilitaryLicense` | Create military license |
| `GET` | `/military-licenses/:id` | Get military license by ID |
| `PATCH` | `/military-licenses/:id` | Update military license |
| `DELETE` | `/military-licenses/:id` | Delete military license |
| `GET` | `/military-licenses/getUniqueFieldValues` | Get unique field values |
| `GET` | `/military-licenses/byChassisNumber/:chassis_number` | Get by chassis number |
| `GET` | `/military-licenses/byVehicleId/:vehicleId` | Get by vehicle ID |

---

## 📊 Data Models

### 👤 User Model

```javascript
{
  id: UUID,                    // Unique identifier
  username: String,            // Login username (3-50 chars)
  password: String,            // Hashed password (6-20 chars)
  role: Enum,                  // ["admin", "GPS", "license", "viewer", "user"]
  passwordChangedAt: Date,     // Password change timestamp
  active: Boolean              // Account status
}
```

### 🚗 Vehicle Model

```javascript
### 🚗 Vehicle Model

```javascript
{
  id: UUID,                          // Unique identifier
  code: String,                      // Vehicle code (unique)
  chassis_number: String,            // Chassis number (unique)
  vehicle_type: String,              // Type of vehicle
  vehicle_equipment: String,         // Equipment specifications
  plate_number_malaky: String,       // Civilian plate (unique)
  plate_number_gesh: String,         // Military plate (unique)
  plate_number_mokhabrat: String,    // Intelligence plate (unique)
  engine_number: String,             // Engine identification
  color: String,                     // Vehicle color
  gps_device_number: String,         // GPS tracking device
  line_number: String,               // Line identification
  sector: String,                    // Operational sector
  model_year: Integer,               // Manufacturing year (1800-current+1)
  fuel_type: String,                 // Fuel type (diesel, gasoline, etc.)
  administration: String,            // Managing administration
  responsible_person: String,        // Person responsible
  supply_source: String,             // Supplier information
  insurance_status: String,          // Insurance status
  insurance_policy: String,          // Policy number
  customs_clearance: String,         // Customs clearance info
  insurance_document: String,        // Insurance document reference
  license_status: String,            // Current license status
  notes: JSON,                       // Flexible notes system
  createdAt: Date,                   // Creation timestamp
  updatedAt: Date                    // Last update timestamp
}
```
```

### 📋 License Model

```javascript
{
  id: UUID,                    // Unique identifier
  serial_number: Integer,      // Serial number
  plate_number: String,        // Associated plate number (unique)
  license_type: String,        // Type of license
  vehicle_type: String,        // Vehicle type
  chassis_number: String,      // Chassis number (unique)
  license_start_date: Date,    // License start date
  license_end_date: Date,      // License end date
  recipient: String,           // License recipient
  notes: Text,                 // Additional notes
  violations: Text,            // Violation records
  vehicleId: UUID,             // Associated vehicle ID
  validity_status: Virtual     // Calculated validity status
}
```

### 🪖 Military License Model

```javascript
{
  id: UUID,                           // Unique identifier
  chassis_number: String,             // Chassis number (unique)
  plate_number_gesh: String,          // Military plate number (unique)
  vehicle_type: String,               // Type of vehicle
  vehicle_equipment: String,          // Equipment specifications
  allocation: String,                 // Vehicle allocation
  load_capacity: String,              // Load capacity specifications
  management_method: String,          // Management methodology
  estimated_financial_value: Float,   // Financial valuation
  active: Boolean,                    // Active status (default: true)
  vehicleId: UUID,                    // Foreign key to Vehicle
  createdAt: Date,                    // Creation timestamp
  updatedAt: Date                     // Last update timestamp
}
```

---

## 🔐 Authentication & Authorization

### 👥 User Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full system access, user management |
| **GPS** | GPS-related operations and viewing |
| **license** | License management and operations |
| **viewer** | Read-only access to all data |
| **user** | Basic access with limited permissions |

### 🔒 Security Features

- 🔐 JWT-based authentication with secure tokens
- 🔒 Password hashing using bcryptjs
- 🛡️ Role-based access control (RBAC)
- 🚪 Protected routes with middleware
- 🍪 Secure HTTP-only cookie handling
- 📅 Password change timestamp tracking
- ✅ Account activation status management
- 🔄 Automatic token refresh mechanism
- 🛡️ **Helmet.js** - Security headers (XSS, CSRF protection)
- 🧼 **XSS-Clean** - Cross-site scripting attack prevention
- 🌐 **CORS** - Configurable cross-origin resource sharing
- 🔒 **SSL/TLS** - Secure database connections for production

---

## ✅ Data Validation

### Users
- ✅ Username: 3-50 characters, unique
- ✅ Password: 6-20 characters, hashed
- ✅ Role: Must be valid enum value
- ✅ Email format validation (if applicable)

### Vehicles
- ✅ Unique chassis numbers and plate numbers
- ✅ Valid model years (reasonable range)
- ✅ JSON validation for notes field
- ✅ Indexed fields for performance

### Licenses
- ✅ Required fields validation
- ✅ Date range validation (start < end)
- ✅ Duplicate license prevention
- ✅ Automatic vehicle association
- ✅ Real-time expiry calculations

---

## ⚠️ Error Handling

The API implements comprehensive error handling:

| Status Code | Description |
|-------------|-------------|
| **400** | Bad Request - Validation errors |
| **401** | Unauthorized - Authentication required |
| **403** | Forbidden - Insufficient permissions |
| **404** | Not Found - Resource not found |
| **409** | Conflict - Duplicate resource |
| **422** | Unprocessable Entity - Invalid data |
| **500** | Internal Server Error - Server errors |

---

## � Data Migration & DevOps

### 🔄 CSV Data Import

The system includes comprehensive CSV import capabilities:

- **Vehicle Data Import** - Automated CSV to JSON conversion with field mapping
- **License Data Import** - Bulk license import with validation
- **Military License Import** - Specialized military license data processing
- **Data Linking** - Automatic vehicle-license association
- **Validation Reports** - Detailed import validation and error reporting

### 🚀 CI/CD Pipeline

**Jenkins Integration:**
- Automated build and deployment pipeline
- Frontend integration (React build inclusion)
- Docker image building and pushing
- Multi-stage deployment process
- Build optimization with caching

### 🗄️ Database Management

**Backup & Restore:**
- Automated Aiven PostgreSQL to local backup
- Scheduled backup scripts
- Data migration utilities
- Cloud deployment automation

**Scripts Available:**
- `backupAndRestore.sh` - Database backup automation
- `uploadToAiven.sh` - Cloud deployment
- `fillDB.js` - Database seeding
- `bulkInsertMilitaryLicenses.js` - Bulk operations

---

## �🐳 Docker Deployment

### Using Docker

```bash
# Build the image
docker build -t haraka-express .

# Run the container
docker run -p 4000:4000 \
  -e DB_NAME=your_db \
  -e DB_USER=your_user \
  -e DB_PASSWORD=your_password \
  -e DB_HOST=your_host \
  haraka-express
```

### Using Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres
      
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=haraka_express
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
