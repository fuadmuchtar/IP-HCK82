const request = require('supertest')
const app = require('../app')
const { cleanUp, seed, getToken } = require('../helpers/jest')

let userToken
let adminToken

beforeAll(async () => {
  await cleanUp()
  await seed()
  userToken = await getToken('user1@gmail.com', 'user1')
  adminToken = await getToken('admin@gmail.com', 'admin', true)
})

afterAll(async () => {
  await cleanUp()
})

describe('Category Tests', () => {
  describe('GET /categories', () => {
    test('should return all categories', async () => {
      const response = await request(app)
        .get('/categories')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('name')
    })
  })

  describe('POST /admin/categories', () => {
    test('should create a category when admin is authenticated', async () => {
      const newCategory = {
        name: 'Test Category'
      }

      const response = await request(app)
        .post('/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCategory)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', newCategory.name)
    })

    test('should return 401 when not authenticated', async () => {
      const newCategory = {
        name: 'Test Category'
      }

      const response = await request(app)
        .post('/admin/categories')
        .send(newCategory)

      expect(response.status).toBe(401)
    })

    test('should return 403 when authenticated as non-admin', async () => {
      const newCategory = {
        name: 'Test Category'
      }

      const response = await request(app)
        .post('/admin/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCategory)

      expect(response.status).toBe(403)
    })

    test('should return 400 with invalid category data', async () => {
      const invalidCategory = {
        name: 'A' // Too short
      }

      const response = await request(app)
        .post('/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCategory)

      expect(response.status).toBe(400)
    })

    test('should return 400 when category name already exists', async () => {
      // First create a category
      const categoryName = 'Unique Test Category'
      
      await request(app)
        .post('/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: categoryName })
      
      // Try to create another with the same name
      const response = await request(app)
        .post('/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: categoryName })

      expect(response.status).toBe(400)
      expect(response.body.message).toContain('already taken')
    })
  })

  describe('PUT /admin/categories/:id', () => {
    test('should update a category when admin is authenticated', async () => {
      const updatedCategory = {
        name: 'Updated Category'
      }

      const response = await request(app)
        .put('/admin/categories/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedCategory)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name', updatedCategory.name)
    })

    test('should return 404 if category does not exist', async () => {
      const response = await request(app)
        .put('/admin/categories/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Category' })

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message', 'Category not found')
    })
  })
})