const express = require('express')
const publicRouter = require('./public')
const admin = require('./admin')
const AdminController = require('../controllers/AdminController')
const authentication = require('../middleware/authentication')
const adminOnly = require('../middleware/authorization')
const router = express.Router()

router.post('/admin/login', AdminController.login)
router.use('/admin', authentication, adminOnly , admin)

router.use('/', publicRouter)


module.exports = router