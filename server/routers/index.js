const express = require('express')
const public = require('./public')
const admin = require('./admin')
const router = express.Router()

router.use('/admin', admin)

router.use('/', public)


module.exports = router