const express = require('express')
const PublicController = require('../controllers/PublicController')
const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')
const OrderController = require('../controllers/OrderController')
const authentication = require('../middleware/authentication')
const public = express.Router()

public.get('/', PublicController.getHomePage)
public.post('/login', PublicController.login)
public.post('/register', PublicController.register)

public.get('/products', ProductController.getAllProducts)
public.get('/products/:id', ProductController.getProductById)
public.get('/products/c/:categoryId', ProductController.getProductsByCategory)

public.get('/categories', CategoryController.getAllCategories)

public.post('/orders', authentication ,OrderController.createOrder)

module.exports = public