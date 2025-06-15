// File: index.js
const dotenv = require("dotenv");
const db = require("./config/database");
const { setupAssociations, Vehicle, License } = require("./models/models");

db.connect();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const psql = db.getSequelize();

psql.sync().then(() => {
  console.log("Database & tables created!");
  setupAssociations();
});

const port = process.env.PORT || 4000;
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
