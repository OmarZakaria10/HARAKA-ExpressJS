const { DataTypes, Model, Op } = require("sequelize");
const database = require("../config/database");
const sequelize = database.getSequelize();

class militaryLicense extends Model {
  static initModel() {
    militaryLicense.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
        },
        chassis_number: {
          type: DataTypes.STRING,
          unique: true,
        },
        plate_number_gesh: {
          type: DataTypes.STRING,
          unique: true,
        },
        vehicle_type: {
          type: DataTypes.STRING,
        },
        vehicle_equipment: {
          type: DataTypes.STRING,
        },
        allocation: {
          type: DataTypes.STRING,
        },
        load_capacity: {
          type: DataTypes.STRING,
        },
        management_method: {
          type: DataTypes.STRING,
        },
        estimated_financial_value: {
          type: DataTypes.FLOAT,
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        vehicleId: {
          type: DataTypes.UUID,
          // allowNull: false,
          references: {
            model: "Vehicles",
            key: "id",
          },
          unique: true,
        },
      },
      {
        sequelize,
        modelName: "MilitaryLicenses",
      }
    );
    return militaryLicense;
  }
  static associate(models) {
    militaryLicense.belongsTo(models.Vehicle, {
      foreignKey: "vehicleId",
      as: "vehicle",
    });
  }
}

const militaryLicenseModel = militaryLicense.initModel();
module.exports = militaryLicenseModel;
