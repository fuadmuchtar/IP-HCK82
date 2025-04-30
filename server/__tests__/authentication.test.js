const request = require('supertest')
const app = require('../app')
const { cleanUp, seed } = require('../helpers/jest')

beforeAll(async () => {
  await cleanUp()
  await seed()
})

afterAll(async () => {
  await cleanUp()
})

describe('Authentication Tests', () => {
  describe('POST /login', () => {
    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'user1@gmail.com',
          password: 'user1'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('access_token')
    })

    test('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'user1@gmail.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message', 'Invalid email/password')
    })

    test('should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@gmail.com',
          password: 'password123'
        })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message', 'Invalid email/password')
    })

    test('should return 400 when email or password is missing', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'user1@gmail.com'
        })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message', 'Email or password is required')
    })
  })

  describe('POST /admin/login', () => {
    test('should login successfully with valid admin credentials', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({
          email: 'admin@gmail.com',
          password: 'admin'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('access_token')
    })

    test('should return 401 with invalid admin credentials', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({
          email: 'admin@gmail.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message', 'Invalid email/password')
    })
  })

  describe('POST /register', () => {
    test('should register a new user successfully', async () => {
      const newUser = {
        fullName: 'Test User',
        email: 'testuser@gmail.com',
        password: 'password123',
        phoneNumber: '1234567890',
        address: 'Test Address'
      }

      const response = await request(app)
        .post('/register')
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('fullName', newUser.fullName)
      expect(response.body).toHaveProperty('email', newUser.email)
      expect(response.body).not.toHaveProperty('password')
    })

    test('should return 400 when registering with existing email', async () => {
      const existingUser = {
        fullName: 'Duplicate User',
        email: 'user1@gmail.com', // existing email
        password: 'password123',
        phoneNumber: '1234567890',
        address: 'Test Address'
      }

      const response = await request(app)
        .post('/register')
        .send(existingUser)

      expect(response.status).toBe(400)
      expect(response.body.message).toContain('Email has already taken')
    })

    test('should return 400 when registering with invalid data', async () => {
      const invalidUser = {
        fullName: 'A', // too short
        email: 'invalid-email',
        password: 'pass', // too short
        phoneNumber: '1234567890',
        address: 'Test Address'
      }

      const response = await request(app)
        .post('/register')
        .send(invalidUser)

      expect(response.status).toBe(400)
    })
  })
})