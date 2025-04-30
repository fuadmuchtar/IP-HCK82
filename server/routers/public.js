const express = require('express')
const PublicController = require('../controllers/PublicController')
const ProductController = require('../controllers/ProductController')
const public = express.Router()

public.get('/', PublicController.getHomePage)
public.post('/login', PublicController.login)
public.post('/register', PublicController.register)

public.get('/products', ProductController.getAllProducts)
public.get('/products/:id', ProductController.getProductById)
public.get('/products/c/:categoryId', ProductController.getProductsByCategory)


module.exports = public