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
  - [🔐 Authentication & Authorization](#-authentication--authorization)
    - [👥 User Roles](#-user-roles)
    - [🔒 Security Features](#-security-features)
  - [✅ Data Validation](#-data-validation)
  - [⚠️ Error Handling](#️-error-handling)
  - [🐳 Docker Deployment](#-docker-deployment)
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
```

---

## 📁 Project Structure

```
HARAKA-Express/
├── 📁 config/
│   └── database.js          # Database configuration
├── 📁 controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── vehicleController.js # Vehicle operations
│   └── licenseController.js # License management
├── 📁 models/
│   └── models.js           # Database models
├── 📁 routes/
│   ├── userRoutes.js       # User endpoints
│   ├── vehicleRoutes.js    # Vehicle endpoints
│   └── licenseRoutes.js    # License endpoints
├── 📁 utils/
│   └── appError.js         # Error handling
├── 📁 public/              # Static files
├── 📁 build/               # Frontend build files
├── app.js                  # Express app configuration
├── index.js                # Application entry point
├── package.json            # Dependencies
├── dockerfile              # Docker configuration
└── README.md               # This file
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
| `GET` | `/military-licenses` | Get all military licenses |
| `POST` | `/military-licenses` | Create military license |
| `GET` | `/military-licenses/:id` | Get military license by ID |
| `PATCH` | `/military-licenses/:id` | Update military license |
| `DELETE` | `/military-licenses/:id` | Delete military license |

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
{
  id: UUID,                    // Unique identifier
  code: String,                // Vehicle code
  chassis_number: String,      // Unique chassis number
  vehicle_type: String,        // Type of vehicle
  vehicle_equipment: String,   // Equipment details
  plate_number_malaky: String, // Malaky plate number
  plate_number_gesh: String,   // Gesh plate number
  plate_number_mokhabrat: String, // Mokhabrat plate number
  engine_number: String,       // Engine number
  color: String,               // Vehicle color
  gps_device_number: String,   // GPS device identifier
  line_number: String,         // Line number
  sector: String,              // Operational sector
  model_year: Integer,         // Manufacturing year
  fuel_type: String,           // Fuel type
  administration: String,      // Managing administration
  responsible_person: String,  // Responsible person
  supply_source: String,       // Supply source
  insurance_status: String,    // Insurance status
  notes: JSON                  // Additional notes
}
```

### 📋 License Model

```javascript
{
  id: UUID,                    // Unique identifier
  serial_number: Integer,      // Serial number
  plate_number: String,        // Associated plate number
  license_type: String,        // Type of license
  vehicle_type: String,        // Vehicle type
  chassis_number: String,      // Chassis number
  license_start_date: Date,    // License start date
  license_end_date: Date,      // License end date
  recipient: String,           // License recipient
  notes: Text,                 // Additional notes
  violations: Text,            // Violation records
  vehicleId: UUID,             // Associated vehicle ID
  validity_status: Virtual     // Calculated validity status
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

## 🐳 Docker Deployment

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

