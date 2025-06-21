// config/database.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
let chalk = null;
if (process.env.NODE_ENV === "development") {
  chalk = require("chalk");
}
dotenv.config({ path: "./config.env" });
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    // Use DATABASE_URL if available, otherwise use individual params
    if (process.env.DATABASE_URL) {
      this.sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging:
          process.env.NODE_ENV === "development"
            ? (query, timing) => {
                const formattedQuery = query.replace(
                  /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|AND|OR|JOIN|GROUP BY|ORDER BY|LIMIT)\b/g,
                  (match) => `\n${chalk.yellow(match)}`
                );
                console.log(
                  "\n" +
                    chalk.blue(
                      "╔════ SQL Query ═══════════════════════════════════════════════╗"
                    ) +
                    "\n" +
                    chalk.cyan(formattedQuery) +
                    "\n" +
                    chalk.blue(
                      "╚════════════════════════════════════════════════════════════╝"
                    ) +
                    "\n" +
                    chalk.gray(`Execution time: ${timing}ms`)
                );
              }
            : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
    } else {
      this.sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: "postgres",
          // logging: false,
          logging:
            process.env.NODE_ENV === "development"
              ? (query, timing) => {
                  const formattedQuery = query.replace(
                    /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|AND|OR|JOIN|GROUP BY|ORDER BY|LIMIT)\b/g,
                    (match) => `\n${chalk.yellow(match)}`
                  );
                  console.log(
                    "\n" +
                      chalk.blue(
                        "╔════ SQL Query ═══════════════════════════════════════════════╗"
                      ) +
                      "\n" +
                      chalk.cyan(formattedQuery) +
                      "\n" +
                      chalk.blue(
                        "╚════════════════════════════════════════════════════════════╝"
                      ) +
                      "\n" +
                      chalk.gray(`Execution time: ${timing}ms`)
                  );
                }
              : false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        }
      );
    }

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
