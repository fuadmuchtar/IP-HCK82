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
        notNull: {
          msg: 'Product name cannot be null'
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
      defaultValue: 1000,
      validate: {
        isNumeric: {
          msg: 'Price must be a number'
        },
        min: {
          args: [1000],
          msg: 'Price minimum is 1000'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Stock must be an integer'
        },
        min: {
          args: [0],
          msg: 'Stock must be greater than or equal to 0'
        },
        notNull: {
          msg: 'Stock cannot be null'
        },
        notEmpty: {
          msg: 'Stock cannot be empty'
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
        notNull: {
          msg: 'Description cannot be null'
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Category cannot be null'
        },
        notEmpty: {
          msg: 'Category cannot be empty'
        }
      }
    },
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