'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order)
      User.hasMany(models.Cart)
    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        notNull: {
          msg: 'Name cannot be null'
        },
        len: {
          args: [3, 50],
          msg: 'Name must be between 3 and 50 characters'
        }
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email has already taken'
      },
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email must be valid'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: {
          args: [4, 20],
          msg: 'Password must be between 6 and 20 characters'
        }
      }
    },
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://res.cloudinary.com/dpepx9rhe/image/upload/fl_preserve_transparency/v1745951413/profile_dummy_awnehj.jpg?_s=public-apps"
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(ins=>{
    ins.password = hashPassword(ins.password)
  })
  return User;
};