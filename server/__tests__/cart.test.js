const request = require('supertest');
const app = require('../app');
const { cleanUp, seed, getToken } = require('../helpers/jest');
const { Cart, Product } = require('../models');

describe('Cart Endpoints', () => {
  let userToken;
  
  beforeAll(async () => {
    await cleanUp();
    await seed();
    userToken = await getToken('user@mail.com', 'user123', false);
  });

  afterAll(async () => {
    await cleanUp();
  });

  describe('GET /cart', () => {
    it('should get user cart when authenticated', async () => {
      const response = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/cart');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /products/:id/add', () => {
    it('should add product to cart when authenticated', async () => {
      const response = await request(app)
        .post('/products/1/add')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('ProductId', 1);
      expect(response.body).toHaveProperty('quantity', 1);
    });

    it('should increase quantity when adding existing product', async () => {
      // Add product to cart first
      await request(app)
        .post('/products/2/add')
        .set('Authorization', `Bearer ${userToken}`);

      // Add same product again
      const response = await request(app)
        .post('/products/2/add')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ProductId', 2);
      expect(response.body).toHaveProperty('quantity', 2);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/products/1/add');
      
      expect(response.status).toBe(401);
    });

    it('should return 404 when product does not exist', async () => {
      const response = await request(app)
        .post('/products/999/add')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /cart/:id/delete', () => {
    it('should remove product from cart when authenticated', async () => {
      // First add product to cart
      await request(app)
        .post('/products/3/add')
        .set('Authorization', `Bearer ${userToken}`);

      // Then delete it
      const response = await request(app)
        .delete('/cart/3/delete')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product deleted from cart');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .delete('/cart/1/delete');
      
      expect(response.status).toBe(401);
    });

    it('should return 404 when cart item does not exist', async () => {
      const response = await request(app)
        .delete('/cart/999/delete')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});