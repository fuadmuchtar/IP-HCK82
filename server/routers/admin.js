const express = require('express')
const PublicController = require('../controllers/PublicController')
const AdminController = require('../controllers/AdminController')
const admin = express.Router()

admin.get('/', PublicController.getHome)

// products
admin.post('/products', AdminController.createProduct)
admin.get('/products', AdminController.getAllProducts)
admin.put('/products/:id', AdminController.updateProduct)
admin.delete('/products/:id', AdminController.deleteProduct)

// categories
admin.post('/categories', AdminController.createCategory)
admin.get('/categories', AdminController.getAllCategories)
admin.put('/categories/:id', AdminController.updateCategory)

// users
admin.get('/users', AdminController.getAllUsers)

// profile
admin.get('/my-profile', AdminController.getMe)
admin.put('/updateMe', AdminController.updateMe)


module.exports = admin