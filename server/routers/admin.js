const express = require('express')
const PublicController = require('../controllers/PublicController')
const AdminController = require('../controllers/AdminController')
const admin = express.Router()

admin.get('/', PublicController.getHome)
admin.post('/login', AdminController.login)
admin.get('/products', AdminController.getAllProducts)
admin.get('/products/:id', AdminController.getProductById)
admin.get('/categories', AdminController.getAllCategories)
admin.get('/categories/:id', AdminController.getCategoryById)


module.exports = admin