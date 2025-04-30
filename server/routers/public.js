const express = require('express')
const PublicController = require('../controllers/PublicController')
const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')
const OrderController = require('../controllers/OrderController')
const authentication = require('../middleware/authentication')
const publicRouter = express.Router()

publicRouter.get('/', PublicController.getHomePage)
publicRouter.post('/login', PublicController.login)
publicRouter.post('/register', PublicController.register)

publicRouter.get('/products', ProductController.getAllProducts)
publicRouter.get('/products/:id', ProductController.getProductById)
publicRouter.get('/products/c/:categoryId', ProductController.getProductsByCategory)

publicRouter.get('/categories', CategoryController.getAllCategories)

publicRouter.post('/orders', authentication ,OrderController.createOrder)

module.exports = publicRouter