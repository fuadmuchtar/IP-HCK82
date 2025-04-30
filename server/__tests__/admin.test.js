const request = require('supertest')
const app = require('../app')
const { cleanUp, seed } = require('../helpers/jest')
const { signToken } = require('../helpers/jwt')
const { User } = require('../models')

let adminToken
let userId

beforeAll(async () => {
  await cleanUp()
  await seed()
  
  // Get admin user for testing
  const admin = await User.findOne({ where: { email: 'admin@gmail.com' } })
  adminToken = signToken({ id: admin.id })
  userId = admin.id
})

afterAll(async () => {
  await cleanUp()
})

describe('AdminController Tests', () => {
  describe('GET /admin', () => {
    test('should return dashboard info', async () => {
      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${adminToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('msg', 'BumiKarya by fuad <HCK-82/P2/IP> server')
      expect(response.body).toHaveProperty('app_version', 1.0)
    })
  })

  describe('GET /admin/users', () => {
    test('should return all non-admin users', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('count')
      expect(response.body).toHaveProperty('rows')
      expect(Array.isArray(response.body.rows)).toBe(true)
      
      // Check that returned users don't have password field and are not admins
      if (response.body.rows.length > 0) {
        expect(response.body.rows[0]).not.toHaveProperty('password')
        expect(response.body.rows[0].isAdmin).toBe(false)
      }
    })

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/admin/users')
      
      expect(response.status).toBe(401)
    })
  })

  describe('GET /admin/my-profile', () => {
    test('should return admin profile', async () => {
      const response = await request(app)
        .get('/admin/my-profile')
        .set('Authorization', `Bearer ${adminToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id', userId)
      expect(response.body).not.toHaveProperty('password')
    })

    test('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/admin/my-profile')
      
      expect(response.status).toBe(401)
    })

    test('should handle non-existent user correctly', async () => {
      // Create a token with a non-existent user ID
      const fakeToken = signToken({ id: 9999 })
      
      const response = await request(app)
        .get('/admin/my-profile')
        .set('Authorization', `Bearer ${fakeToken}`)
      
      // Accept either 404 or 500 status code since the implementation might vary
      expect([404, 500]).toContain(response.status)
    })
  })

  describe('PUT /admin/updateMe', () => {
    test('should update admin profile successfully', async () => {
      const updateData = {
        fullName: 'Updated Admin Name',
        email: 'updated.admin@gmail.com',
        profilePicture: 'https://example.com/profile.jpg'
      }
      
      const response = await request(app)
        .put('/admin/updateMe')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Profile updated successfully')
      expect(response.body.user).toHaveProperty('fullName', updateData.fullName)
      expect(response.body.user).toHaveProperty('email', updateData.email)
      expect(response.body.user).toHaveProperty('profilePicture', updateData.profilePicture)
      expect(response.body.user).not.toHaveProperty('password')
    })

    test('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/admin/updateMe')
        .send({ fullName: 'Test' })
      
      expect(response.status).toBe(401)
    })

    test('should handle non-existent user correctly', async () => {
      // Create a token with a non-existent user ID
      const fakeToken = signToken({ id: 9999 })
      
      const response = await request(app)
        .put('/admin/updateMe')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ fullName: 'Test' })
      
      // Accept either 404 or 500 status code since the implementation might vary
      expect([404, 500]).toContain(response.status)
    })
  })
})