const { comparePassword } = require("../helpers/bcryptjs");
const { signToken } = require("../helpers/jwt");
const { User, Product, Category } = require("../models");

class AdminController {
  static async login(req, res, next){
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw { name: 'BadRequest', message: 'Email or password is required'}
      }
      const user = await User.findOne({ where: { email }})
      if (!user) {
        throw { name: 'Unauthorized', message: 'Invalid email/password'}
      }

      const isValidPassword = comparePassword(password, user.password)
      if (!isValidPassword) {
        throw { name: 'Unauthorized', message: 'Invalid email/password'}
      }

      const access_token = signToken({ id: user.id })
      res.status(200).json({access_token})
    } catch (error) {
        console.log(error)
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
        console.log(error)
      next(error);
    }
  }
  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: {
          model: Category,
          attributes: ['name']
        }
      });
      if (!product) {
        throw { name: 'NotFound', message: 'Product not found' }
      }
      res.status(200).json(product);
    } catch (error) {
        console.log(error)
      next(error);
    }
  }

//   static async getAllUsers(req, res, next) {
//     try {
//       const users = await User.findAll({
//         attributes: { exclude: ['password'] }
//       });
//       res.status(200).json(users);
//     } catch (error) {
//       next(error);
//     }
//   }
}

module.exports = AdminController;
