# Future of Egypt - Vehicle Management System

A comprehensive vehicle management system built with Node.js, Express, and Sequelize to manage and track vehicle fleets.

## Features

- Vehicle tracking with detailed information
- Multiple plate number types support (Malaky, Gesh, Mokhabrat)
- GPS device tracking
- Vehicle maintenance and insurance status tracking
- Sector and administration management
- Advanced search and filtering capabilities
- Full CRUD operations for vehicles

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL/PostgreSQL (Database)
- REST API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd futureOfEgypt
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=future_egypt
PORT=3000
```

4. Run database migrations:
```bash
npx sequelize-cli db:migrate
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### Vehicles

- `GET /vehicles` - Get all vehicles
- `GET /vehicles/:id` - Get a specific vehicle
- `POST /vehicles/createVehicle` - Create a new vehicle
- `PATCH /vehicles/updateVehicle/:id` - Update a vehicle
- `DELETE /vehicles/deleteVehicle/:id` - Delete a vehicle

## Vehicle Model Structure

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

## Data Validation

- Unique chassis numbers
- Valid model years (between 1800 and current year + 1)
- Unique plate numbers
- JSON storage for flexible notes

## Error Handling

The API implements comprehensive error handling:
- 404 for resources not found
- 400 for invalid requests
- 500 for server errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.