const { DataTypes } = require("sequelize");
const database = require("../config/database");
const sequelize = database.getSequelize();

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
    },
    chassis_number: {
      type: DataTypes.STRING,
      // allowNull: false,
      unique: true,
    },
    vehicle_type: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    vehicle_equipment: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    plate_number_malaky: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    plate_number_gesh: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    plate_number_mokhabrat: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    engine_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gps_device_number: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    line_number: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      // allowNull: false,
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
      allowNull: true,
    },
    administration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    responsible_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supply_source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insurance_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
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

// Instance methods for handling notes
Vehicle.prototype.addNote = function (key, value) {
  const currentNotes = this.notes || {};
  this.notes = { ...currentNotes, [key]: value };
  return this.notes;
};

Vehicle.prototype.getNote = function (key) {
  return this.notes && this.notes[key];
};

Vehicle.prototype.getAllNotes = function () {
  return this.notes || {};
};

Vehicle.prototype.removeNote = function (key) {
  if (!this.notes || !this.notes[key]) return false;
  const { [key]: removed, ...restNotes } = this.notes;
  this.notes = restNotes;
  return true;
};

module.exports = Vehicle;
