'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User)
      Order.hasMany(models.OrderItem)
      
      Order.belongsToMany(models.Product, { through: models.OrderItem })
    }
  }
  Order.init({
    UserId: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING,
    deliveryStatus: DataTypes.STRING,
    totalPayment: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  Order.beforeCreate(ins => {

    ins.paymentStatus = 'pending'
    ins.deliveryStatus = 'pending'
  }
  )
  return Order;
};