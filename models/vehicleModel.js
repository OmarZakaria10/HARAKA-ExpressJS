const { DataTypes, Model } = require("sequelize");
const database = require("../config/database");
const sequelize = database.getSequelize();

class Vehicle extends Model {
  static initModel() {
    Vehicle.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
        },
        code: {
          type: DataTypes.STRING,
          unique: true,
        },
        chassis_number: {
          type: DataTypes.STRING,
          unique: true,
        },
        vehicle_type: {
          type: DataTypes.STRING,
        },
        vehicle_equipment: {
          type: DataTypes.STRING,
        },
        plate_number_malaky: {
          type: DataTypes.STRING,
          unique: true,
        },
        plate_number_gesh: {
          type: DataTypes.STRING,
          unique: true,
        },
        plate_number_mokhabrat: {
          type: DataTypes.STRING,
          unique: true,
        },
        engine_number: {
          type: DataTypes.STRING,
        },
        color: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        gps_device_number: {
          type: DataTypes.STRING,
        },
        line_number: {
          type: DataTypes.STRING,
        },
        sector: {
          type: DataTypes.STRING,
        },
        model_year: {
          type: DataTypes.INTEGER,
          validate: {
            isInt: {
              msg: "Year must be a valid integer",
            },
            min: {
              args: [1800],
              msg: "Year must be after 1900",
            },
            max: {
              args: [new Date().getFullYear() + 1],
              msg: "Year cannot be in the future",
            },
          },
        },
        fuel_type: {
          type: DataTypes.STRING,
        },
        administration: {
          type: DataTypes.STRING,
        },
        responsible_person: {
          type: DataTypes.STRING,
        },
        supply_source: {
          type: DataTypes.STRING,
        },
        insurance_status: {
          type: DataTypes.STRING,
        },
        notes: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: {},
        },
      },
      {
        sequelize,
        modelName: "Vehicles",
        timestamps: true,
        indexes: [
          {
            fields: ["chassis_number"],
          },
          {
            fields: ["plate_number_malaky"],
          },
          {
            fields: ["vehicle_type"],
          },
          {
            fields: ["vehicle_equipment"],
          },
          {
            fields: ["sector"],
          },
          {
            fields: ["administration"],
          },
        ],
      }
    );

    return Vehicle;
  }

  // Instance methods for handling notes
  addNote(key, value) {
    const currentNotes = this.notes || {};
    this.notes = { ...currentNotes, [key]: value };
    return this.notes;
  }

  getNote(key) {
    return this.notes && this.notes[key];
  }

  getAllNotes() {
    return this.notes || {};
  }

  removeNote(key) {
    if (!this.notes || !this.notes[key]) return false;
    const { [key]: removed, ...restNotes } = this.notes;
    this.notes = restNotes;
    return true;
  }

  static associate(models) {
    // Define one-to-one relationship with License
    // A Vehicle may have one License
    this.hasOne(models.License, {
      foreignKey: "vehicleId",
      as: "license",
      onDelete: "CASCADE", // If vehicle is deleted, delete associated license
    });
  }
}

// Initialize the model
const VehicleModel = Vehicle.initModel();

module.exports = Vehicle;
