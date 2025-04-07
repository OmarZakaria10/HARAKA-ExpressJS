// config/database.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        // logging: false,
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );

    Database.instance = this;
  }

  getSequelize() {
    return this.sequelize;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log("Database connection successful");
      return true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return false;
    }
  }

  async sync(options = {}) {
    return this.sequelize.sync(options);
  }

  async close() {
    await this.sequelize.close();
    console.log("Database connection closed");
  }
}

module.exports = new Database();
