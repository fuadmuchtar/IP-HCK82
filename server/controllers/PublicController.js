const { Op } = require('sequelize')
const { User } = require('../models')
const { comparePassword } = require('../helpers/bcryptjs')
const { signToken } = require('../helpers/jwt')

class PublicController{

    static async getHomePage(req, res, next){
        try {
            res.json({msg: "BumiKarya by fuad <HCK-82/P2/IP> public", app_version: 1.0})
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
          const user = await User.findOne({ 
            where: { 
              email,
              isAdmin: false 
            } 
          })
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
    // static async register(req, res, next) {
    //     try {
    
    //       const user = await User.create(req.body);
    
    //       const newUser = user.toJSON();
    //       delete newUser.password;
    
    //       res.status(201).json(newUser);
    //     } catch (error) {
    //       next(error)
    //     }
    //   }
}

module.exports = PublicController