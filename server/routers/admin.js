const express = require('express')
const PublicController = require('../controllers/PublicController')
const AdminController = require('../controllers/AdminController')
const admin = express.Router()

admin.get('/', PublicController.getHome)
admin.post('/login', AdminController.login)
admin.get('/products', AdminController.getAllProducts)


module.exports = admin