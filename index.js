// File: index.js
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
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

setupAssociations();

psql.sync({ alter: true })
  .then(() => {
    console.log("Database & tables synced!");
  })
  .catch((err) => {
    console.error("Sync error:", err);
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
