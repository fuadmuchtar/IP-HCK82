'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category)
      Product.hasMany(models.OrderItem)

      Product.belongsToMany(models.Order, { through: models.OrderItem })
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product name cannot be empty'
        },
        len: {
          args: [3, 50],
          msg: 'Product name must be between 3 and 50 characters'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isNumeric: {
          msg: 'Price must be a number'
        },
        min: {
          args: 0,
          msg: 'Price must be greater than or equal to 0'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isNumeric: {
          msg: 'Stock must be a number'
        },
        min: {
          args: 0,
          msg: 'Stock must be greater than or equal to 0'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        },
        len: {
          args: [10, 500],
          msg: 'Description must be between 10 and 500 characters'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        },
        len: {
          args: [10, 500],
          msg: 'Description must be between 10 and 500 characters'
        }
      }
    },
    CategoryId: DataTypes.INTEGER,
    imgUrl: DataTypes.STRING,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};