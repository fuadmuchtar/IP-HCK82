'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Product)
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_name',
        msg: 'Category name has already taken'
      },
      validate: {
        notEmpty: {
          msg: 'Category name cannot be empty'
        },
        notNull: {
          msg: 'Category name cannot be null'
        },
        len: {
          args: [3, 50],
          msg: 'Category name must be between 3 and 50 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};