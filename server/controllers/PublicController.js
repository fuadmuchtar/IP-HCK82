const { Op } = require('sequelize')
const { Product, Category } = require('../models')

class PublicController{

    static async getHome(req, res, next){
        try {
            res.json({msg: "resto app by fuad <HCK-82/P2/IP>", app_version: 1.0})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = PublicController