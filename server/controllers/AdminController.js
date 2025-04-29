const { comparePassword } = require("../helpers/bcryptjs");
const { signToken } = require("../helpers/jwt");
const { User, Product, Category } = require("../models");

class AdminController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw { name: 'BadRequest', message: 'Email or password is required' }
      }
      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw { name: 'Unauthorized', message: 'Invalid email/password' }
      }

      const isValidPassword = comparePassword(password, user.password)
      if (!isValidPassword) {
        throw { name: 'Unauthorized', message: 'Invalid email/password' }
      }

      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }
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
  static async createCategory(req, res, next) {
    try {
      const newCategory = await Category.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        throw { name: 'NotFound', message: 'Category not found' }
      }
      const updatedCategory = await category.update(req.body);
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
  static async getAllUsers(req, res, next) {
    try {
      const users = await User.findAndCountAll({
        where: { isAdmin: false },
        attributes: {
          exclude: ['password']
        }
      });
      if (!users) {
        throw { name: 'NotFound', message: 'Users is empty' }
      }
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
  static async getMe(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: {
          exclude: ['password']
        }
      });
      if (!user) {
        throw { name: 'NotFound', message: 'User not found' }
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
  static async updateMe(req, res, next) {
    try {
      const { fullName, email, password, profilePicture } = req.body;
      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw { name: 'NotFound', message: 'User not found' }
      }
      const updatedUser = await user.update({ fullName, email, password, profilePicture });
      const userResponse = updatedUser.toJSON();
      delete userResponse.password;
      res.status(200).json({ message: 'Profile updated successfully', user: userResponse });
    } catch (error) {
      next(error);
    }
  }


}

module.exports = AdminController;
