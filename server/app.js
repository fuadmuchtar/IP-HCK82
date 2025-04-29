if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const app = express()
const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/', require('./routers'))

app.use(errorHandler)

module.exports = app





