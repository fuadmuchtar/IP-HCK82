const express = require('express')
const public = require('./public')
const router = express.Router()

router.use('/', public)


module.exports = router