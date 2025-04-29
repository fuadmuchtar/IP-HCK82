const express = require('express')
const PublicController = require('../controllers/PublicController')
const admin = express.Router()

admin.get('/', PublicController.getHome)


module.exports = admin