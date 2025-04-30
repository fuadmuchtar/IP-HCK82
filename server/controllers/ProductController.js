const { Product, Category } = require('../models')
const { Op } = require('sequelize')

class ProductController {
    static async createProduct(req, res, next) {
        try {
          const newProduct = await Product.create(req.body)
          res.status(201).json(newProduct)
        } catch (error) {
          console.log(error, "<<< error create product")
          next(error)
        }
      }
      static async getAllProducts(req, res, next) {
        try {
          const products = await Product.findAll({
            include: {
              model: Category,
              attributes: ['name']
            }
          });
          res.status(200).json(products);
        } catch (error) {
          next(error);
        }
      }
      static async updateProduct(req, res, next) {
        try {
          const { id } = req.params;
          console.log(req.body, "<<< req.body")
          const product = await Product.findByPk(id);
          if (!product) {
            throw { name: 'NotFound', message: 'Product not found' }
          }
          const updatedProduct = await product.update(req.body);
          res.status(200).json(updatedProduct);
        } catch (error) {
          next(error);
        }
      }
      static async deleteProduct(req, res, next) {
        try {
          const { id } = req.params;
          const product = await Product.findByPk(id);
          if (!product) {
            throw { name: 'NotFound', message: 'Product not found' }
          }
          await product.destroy();
          res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
          next(error);
        }
      }
}

module.exports = ProductController