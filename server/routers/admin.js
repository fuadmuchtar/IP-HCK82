const express = require('express')
const PublicController = require('../controllers/PublicController')
const AdminController = require('../controllers/AdminController')
const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')
const admin = express.Router()

admin.get('/', AdminController.getDashboard)

// products
admin.post('/products', ProductController.createProduct)
admin.get('/products', ProductController.getAllProducts)
admin.put('/products/:id', ProductController.updateProduct)
admin.delete('/products/:id', ProductController.deleteProduct)

// categories
admin.post('/categories', CategoryController.createCategory)
admin.get('/categories', CategoryController.getAllCategories)
admin.put('/categories/:id', CategoryController.updateCategory)

// users
admin.get('/users', AdminController.getAllUsers)

// profile
admin.get('/my-profile', AdminController.getMe)
admin.put('/updateMe', AdminController.updateMe)


module.exports = admin