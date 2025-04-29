const express = require('express')
const PublicController = require('../controllers/PublicController')
const public = express.Router()

public.get('/', PublicController.getHome)


module.exports = public