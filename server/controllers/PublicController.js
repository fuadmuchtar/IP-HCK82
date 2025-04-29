const { Op } = require('sequelize')
const { User, Product, Category } = require('../models')

class PublicController{

    static async getHome(req, res, next){
        try {
            res.json({msg: "resto app by fuad <HCK-82/P2/IP>", app_version: 1.0})
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