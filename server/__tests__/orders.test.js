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

describe('Order Tests', () => {
  describe('POST /orders', () => {
    test('should create an order when user is authenticated', async () => {
      const cart = [
        {
          ProductId: 1,
          quantity: 2
        },
        {
          ProductId: 2,
          quantity: 1
        }
      ]

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('order')
      expect(response.body).toHaveProperty('orderItems')
      expect(response.body.order).toHaveProperty('UserId')
      expect(response.body.order).toHaveProperty('paymentStatus', 'pending')
      expect(Array.isArray(response.body.orderItems)).toBe(true)
      expect(response.body.orderItems.length).toBe(cart.length)
    })

    test('should return 401 when not authenticated', async () => {
      const cart = [
        {
          ProductId: 1,
          quantity: 2
        }
      ]

      const response = await request(app)
        .post('/orders')
        .send(cart)

      expect(response.status).toBe(401)
    })

    test('should return 404 when product does not exist', async () => {
      const cart = [
        {
          ProductId: 999, // Non-existent product
          quantity: 2
        }
      ]

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart)

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message', 'Product not found')
    })

    test('should correctly calculate total payment', async () => {
      // First get product data to calculate expected total
      const product1Response = await request(app).get('/products/1')
      const product2Response = await request(app).get('/products/2')
      
      const product1Price = product1Response.body.price
      const product2Price = product2Response.body.price
      
      const cart = [
        {
          ProductId: 1,
          quantity: 2
        },
        {
          ProductId: 2,
          quantity: 3
        }
      ]

      const expectedTotal = (product1Price * 2) + (product2Price * 3)

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart)

      expect(response.status).toBe(201)
      expect(response.body.order).toHaveProperty('totalPayment', expectedTotal)
    })
  })
})