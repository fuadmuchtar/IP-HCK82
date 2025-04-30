const {Order, Product, User, OrderItem} = require('../models');
const { Op } = require('sequelize');

class OrderController {
    static async createOrder(req, res, next) {
        try {
            const cart = req.body;

            const UserId = req.user.id;

            let totalPayment = 0;
            for (const item of cart) {
                const product = await Product.findByPk(item.ProductId);
                if (!product) {
                    throw { name: 'NotFound', message: 'Product not found' };
                }
                totalPayment += product.price * item.quantity;
            }

            // Create the order
            const order = await Order.create({ 
                UserId,
                paymentStatus: 'pending',
                status: 'pending',
                totalPayment
             });

            let orderItems = [];
            for (const item of cart) {
                const { ProductId, quantity } = item;
                const product = await Product.findByPk(ProductId);

                // Create the order item
                let orderItem = await OrderItem.create({
                    OrderId: order.id,
                    ProductId,
                    productName: product.name,
                    quantity,
                    priceEach: product.price,
                    totalPrice: product.price * quantity
                });
                orderItems.push(orderItem);
            }

            res.status(201).json( {order, orderItems});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;