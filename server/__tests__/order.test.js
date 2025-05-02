const request = require('supertest');
const app = require('../app');
const { cleanUp, seed, getToken } = require('../helpers/jest');
const { Order, OrderItem } = require('../models');

describe('Order Endpoints', () => {
  let userToken;
  
  beforeAll(async () => {
    await cleanUp();
    await seed();
    userToken = await getToken('user@mail.com', 'user123', false);
  });

  afterAll(async () => {
    await cleanUp();
  });

  describe('POST /orders (Create Order)', () => {
    it('should create a new order when authenticated', async () => {
      const cart = [
        { ProductId: 1, quantity: 2 },
        { ProductId: 2, quantity: 1 }
      ];
      
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('order');
      expect(response.body).toHaveProperty('orderItems');
      expect(response.body.order).toHaveProperty('UserId');
      expect(response.body.order).toHaveProperty('totalPayment');
      expect(Array.isArray(response.body.orderItems)).toBe(true);
      expect(response.body.orderItems.length).toBe(2);
    });

    it('should return 401 when not authenticated', async () => {
      const cart = [{ ProductId: 1, quantity: 1 }];
      
      const response = await request(app)
        .post('/orders')
        .send(cart);
      
      expect(response.status).toBe(401);
    });

    it('should return 404 when product does not exist', async () => {
      const cart = [{ ProductId: 999, quantity: 1 }];
      
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it('should handle empty cart', async () => {
      const cart = [];
      
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart);
      
      expect(response.status).toBe(400);
    });
  });

  // Tests for getting order history
  describe('GET /orders (Get User Orders)', () => {
    it('should get user orders when authenticated', async () => {
      // First create an order
      const cart = [{ ProductId: 3, quantity: 1 }];
      await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart);

      const response = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/orders');
      expect(response.status).toBe(401);
    });
  });

  // Tests for getting order details
  describe('GET /orders/:id (Get Order Details)', () => {
    let orderId;

    beforeAll(async () => {
      // Create an order first to get its ID for testing
      const cart = [{ ProductId: 4, quantity: 1 }];
      const orderResponse = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cart);
        
      orderId = orderResponse.body.order.id;
    });

    it('should get order details when authenticated', async () => {
      const response = await request(app)
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', orderId);
      expect(response.body).toHaveProperty('UserId');
      expect(response.body).toHaveProperty('totalPayment');
      expect(response.body).toHaveProperty('OrderItems');
      expect(Array.isArray(response.body.OrderItems)).toBe(true);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get(`/orders/${orderId}`);
      expect(response.status).toBe(401);
    });

    it('should return 404 when order does not exist', async () => {
      const response = await request(app)
        .get('/orders/999')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});