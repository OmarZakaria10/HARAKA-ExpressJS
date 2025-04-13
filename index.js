// File: index.js
const dotenv = require("dotenv");
const db = require("./config/database");
const Vehicle = require("./models/vehicleModel");
db.connect();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");
const psql = db.getSequelize();

psql.sync({}).then(() => {
  console.log("Database & tables created!");
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
