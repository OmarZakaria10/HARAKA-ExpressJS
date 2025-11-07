const { DataTypes, Model, Op } = require("sequelize");
const database = require("../config/database");
const Vehicle = require("./vehicleModel");
const sequelize = database.getSequelize();

class License extends Model {
  static initModel() {
    License.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
        },
        serial_number: {
          type: DataTypes.INTEGER,
        },
        plate_number: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        license_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        vehicle_type: {
          type: DataTypes.STRING,
        },
        chassis_number: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        license_start_date: {
          type: DataTypes.DATE,
          allowNull: true,
          get() {
            if (!this.getDataValue("license_start_date")) return null;
            const date = new Date(this.getDataValue("license_start_date"));
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          },
          set(value) {
            if (!value) return this.setDataValue("license_start_date", null);
            this.setDataValue("license_start_date", new Date(value));
          },
        },

        license_end_date: {
          type: DataTypes.DATE,
          allowNull: true,
          get() {
            if (!this.getDataValue("license_end_date")) return null;
            const date = new Date(this.getDataValue("license_end_date"));
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          },
          set(value) {
            if (!value) return this.setDataValue("license_end_date", null);
            this.setDataValue("license_end_date", new Date(value));
          },
        },
        recipient: {
          type: DataTypes.STRING,
        },
        notes: {
          type: DataTypes.TEXT,
        },
        validity_status: {
          type: DataTypes.VIRTUAL,
          get() {
            if (!this.license_end_date) return "غير معروف";
            const today = new Date();
            const endDate = new Date(this.license_end_date);

            if (endDate < today) {
              return "منتهية";
            }

            const daysRemaining = this.get("days_remaining");
            if (daysRemaining <= 30) {
              return "قاربت على الانتهاء";
            }

            return "سارية";
          },
        },
        violations: {
          type: DataTypes.TEXT,
        },
        // Foreign key to link with Vehicle
        vehicleId: {
          type: DataTypes.UUID,
          // allowNull: false,
          references: {
            model: "Vehicles",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "License",
        timestamps: true,
        indexes: [
          {
            fields: ["id"],
          },
          {
            fields: ["plate_number"],
          },
          {
            fields: ["license_end_date"], // Fixed the index name to match the model attribute
          },
          {
            fields: ["vehicleId"],
          },
        ],
      }
    );

    return License;
  }

  // Instance methods
  isValid() {
    return new Date() < this.license_end_date;
  }

  getDaysRemaining() {
    const today = new Date();
    const expiryDate = new Date(this.license_end_date);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Since notes is now TEXT type, we'll use simpler methods
  setNotes(notes) {
    this.notes = notes;
    return this.notes;
  }

  getNotes() {
    return this.notes || "";
  }

  setViolations(violations) {
    this.violations = violations;
    return this.violations;
  }

  getViolations() {
    return this.violations || "";
  }

  static associate(models) {
    // Define one-to-one relationship with Vehicle
    this.belongsTo(models.Vehicle, {
      foreignKey: "vehicleId",
      as: "vehicle",
    });
  }

  // Static methods
  static async getExpiringLicensesBefore(date) {
    const thresholdDate = new Date(date);
    return await this.findAll({
      where: {
        license_end_date: {
          [Op.lte]: thresholdDate,
        },
      },
      include: [
        {
          model: Vehicle,
          as: "vehicle",
          attributes: ["sector", "administration"],
        },
      ],
      order: [["license_end_date", "ASC"]],
    });
  }

  static async getExpiredLicenses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.findAll({
      where: {
        license_end_date: {
          [Op.lt]: today,
        },
      },
      include: [
        {
          model: Vehicle,
          as: "vehicle",
          attributes: [
            "id",
            "code",
            "chassis_number",
            "vehicle_type",
            "plate_number_malaky",
            "plate_number_gesh",
            "plate_number_mokhabrat",
            "sector",
            "administration",
          ],
        },
      ],
    });
  }
}

// Initialize the model
const LicenseModel = License.initModel();

module.exports = License;
