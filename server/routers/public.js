const express = require('express')
const PublicController = require('../controllers/PublicController')
const public = express.Router()

public.get('/', PublicController.getHomePage)
public.post('/login', PublicController.login)


module.exports = public