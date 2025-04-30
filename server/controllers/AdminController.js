const { comparePassword } = require("../helpers/bcryptjs");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class AdminController {
  static async getDashboard(req, res, next) {
    try {
      res.json({ msg: "BumiKarya by fuad <HCK-82/P2/IP> server", app_version: 1.0 })
    } catch (error) {
      next(error)
    }
  }
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
