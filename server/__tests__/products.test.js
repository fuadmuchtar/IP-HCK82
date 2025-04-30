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

describe('Product Tests', () => {
  describe('GET /products', () => {
    test('should return all products', async () => {
      const response = await request(app)
        .get('/products')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('name')
      expect(response.body[0]).toHaveProperty('price')
      expect(response.body[0]).toHaveProperty('Category')
    })
  })

  describe('GET /products/:id', () => {
    test('should return a product by id', async () => {
      const response = await request(app)
        .get('/products/1')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id', 1)
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('price')
      expect(response.body).toHaveProperty('Category')
    })

    test('should return 404 if product does not exist', async () => {
      const response = await request(app)
        .get('/products/999')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message', 'Product not found')
    })
  })

  describe('GET /products/c/:categoryId', () => {
    test('should return products by category id', async () => {
      const response = await request(app)
        .get('/products/c/1')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty('CategoryId', 1)
    })

    test('should return 404 if category does not exist', async () => {
      const response = await request(app)
        .get('/products/c/999')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message', 'Categories not found')
    })
  })

  describe('POST /admin/products', () => {
    test('should create a product when admin is authenticated', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 100000,
        stock: 10,
        description: 'Test product description',
        CategoryId: 1
      }

      const response = await request(app)
        .post('/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', newProduct.name)
      expect(response.body).toHaveProperty('price', newProduct.price)
    })

    test('should return 401 when not authenticated', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 100000,
        stock: 10,
        description: 'Test product description',
        CategoryId: 1
      }

      const response = await request(app)
        .post('/admin/products')
        .send(newProduct)

      expect(response.status).toBe(401)
    })

    test('should return 403 when authenticated as non-admin', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 100000,
        stock: 10,
        description: 'Test product description',
        CategoryId: 1
      }

      const response = await request(app)
        .post('/admin/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct)

      expect(response.status).toBe(403)
    })

    test('should return 400 with invalid product data', async () => {
      const invalidProduct = {
        name: 'A', // Too short
        price: 500, // Below minimum
        CategoryId: 1
      }

      const response = await request(app)
        .post('/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidProduct)

      expect(response.status).toBe(400)
    })
  })

  describe('PUT /admin/products/:id', () => {
    test('should update a product when admin is authenticated', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 150000,
        stock: 15
      }

      const response = await request(app)
        .put('/admin/products/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedProduct)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name', updatedProduct.name)
      expect(response.body).toHaveProperty('price', updatedProduct.price)
      expect(response.body).toHaveProperty('stock', updatedProduct.stock)
    })

    test('should return 404 if product does not exist', async () => {
      const response = await request(app)
        .put('/admin/products/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Product' })

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message', 'Product not found')
    })
  })

  describe('DELETE /admin/products/:id', () => {
    test('should delete a product when admin is authenticated', async () => {
      // First create a product to delete
      const newProduct = {
        name: 'Product to Delete',
        price: 100000,
        stock: 10,
        description: 'Test product description',
        CategoryId: 1
      }

      const createResponse = await request(app)
        .post('/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)
      
      const productId = createResponse.body.id

      // Then delete it
      const response = await request(app)
        .delete(`/admin/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Product deleted successfully')

      // Verify it's deleted
      const getResponse = await request(app)
        .get(`/products/${productId}`)
      
      expect(getResponse.status).toBe(404)
    })

    test('should return 404 if product does not exist', async () => {
      const response = await request(app)
        .delete('/admin/products/999')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message', 'Product not found')
    })
  })
})