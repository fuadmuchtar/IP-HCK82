const { sequelize } = require('../models')
const { hashPassword } = require('./bcryptjs')
const request = require('supertest')
const app = require('../app')

// Function to clean up database tables
const cleanUp = async () => {
  try {
    await sequelize.queryInterface.bulkDelete('OrderItems', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Orders', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Products', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Categories', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
    await sequelize.queryInterface.bulkDelete('Users', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
  } catch (error) {
    console.log(error)
  }
}

// Function to seed the test database
const seed = async () => {
  try {
    const users = require('../data/users.json').map(el => {
      el.password = hashPassword(el.password)
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await sequelize.queryInterface.bulkInsert('Users', users)
    
    const categories = require('../data/categories.json').map(el => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await sequelize.queryInterface.bulkInsert('Categories', categories)
    
    const products = require('../data/products.json').map(el => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await sequelize.queryInterface.bulkInsert('Products', products)
  } catch (error) {
    console.log(error)
  }
}

// Login helper function to get authentication tokens
const getToken = async (email, password, isAdmin = false) => {
  const endpoint = isAdmin ? '/admin/login' : '/login'
  const response = await request(app)
    .post(endpoint)
    .send({ email, password })
  
  return response.body.access_token
}

module.exports = {
  cleanUp,
  seed,
  getToken
}