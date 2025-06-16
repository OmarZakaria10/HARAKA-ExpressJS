const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
const database = require("../config/database");
const sequelize = database.getSequelize();

class User extends Model {
  static initModel() {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [3, 50],
          },
        },
        // email: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        //   unique: true,
        //   validate: {
        //     isEmail: true,
        //     isLowercase: true,
        //   },
        // },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [6,20],
          },
        },
        role: {
          type: DataTypes.ENUM("admin", "GPS","license","viewer", "user"),
          defaultValue: "user",
          allowNull: false,
        },
        passwordChangedAt: DataTypes.DATE,
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "User",
        hooks: {
          beforeSave: async (user) => {
            if (user.changed("password")) {
              user.password = await bcrypt.hash(user.password, 12);
              user.passwordChangedAt = Date.now() - 1000;
            }
          },
          beforeFind: (options) => {
            options.where = {
              ...options.where,
              active: true,
            };
          },
        },
      }
    );

    return User;
  }

  // Instance methods
  async correctPassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  changedPasswordAfter(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  }

}

const UserModel = User.initModel();
module.exports = UserModel;