const request = require('supertest');
const app = require('../app');
const { cleanUp, seed, getToken } = require('../helpers/jest');
const { Product } = require('../models');

describe('Product Endpoints', () => {
  let adminToken;
  let userToken;
  
  beforeAll(async () => {
    await cleanUp();
    await seed();
    adminToken = await getToken('admin@mail.com', 'admin123', true);
    userToken = await getToken('user@mail.com', 'user123', false);
  });

  afterAll(async () => {
    await cleanUp();
  });

  describe('GET /products', () => {
    it('should get all products', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter products by search query', async () => {
      const response = await request(app).get('/products?search=Kayu');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /products/:id', () => {
    it('should get a product by ID', async () => {
      const response = await request(app).get('/products/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/products/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
    });
  });

  describe('GET /products/c/:categoryId', () => {
    it('should get products by category ID', async () => {
      const response = await request(app).get('/products/c/1');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].CategoryId).toBe(1);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app).get('/products/c/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Categories not found');
    });
  });

  describe('POST /products (Admin only)', () => {
    it('should create a new product when admin is authenticated', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 150000,
        stock: 15,
        imgUrl: 'https://example.com/test.jpg',
        CategoryId: 1
      };
      
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Test Product');
      expect(response.body).toHaveProperty('price', 150000);
    });

    it('should return 401 when no token is provided', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 150000,
        stock: 15,
        imgUrl: 'https://example.com/test.jpg',
        CategoryId: 1
      };
      
      const response = await request(app)
        .post('/products')
        .send(newProduct);
      
      expect(response.status).toBe(401);
    });

    it('should return 403 when user (non-admin) tries to create a product', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 150000,
        stock: 15,
        imgUrl: 'https://example.com/test.jpg',
        CategoryId: 1
      };
      
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct);
      
      expect(response.status).toBe(403);
    });
  });

  describe('PUT /products/:id (Admin only)', () => {
    it('should update a product when admin is authenticated', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 200000,
        stock: 20
      };
      
      const response = await request(app)
        .put('/products/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedProduct);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Product');
    });

    it('should return 401 when no token is provided', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 200000
      };
      
      const response = await request(app)
        .put('/products/1')
        .send(updatedProduct);
      
      expect(response.status).toBe(401);
    });

    it('should return 404 when product does not exist', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 200000
      };
      
      const response = await request(app)
        .put('/products/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedProduct);
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /products/:id (Admin only)', () => {
    it('should delete a product when admin is authenticated', async () => {
      // First create a product to delete
      const newProduct = {
        name: 'Product To Delete',
        price: 50000,
        stock: 5,
        imgUrl: 'https://example.com/delete.jpg',
        CategoryId: 1
      };
      
      const created = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);
      
      const productId = created.body.id;
      
      const response = await request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product deleted successfully');
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .delete('/products/1');
      
      expect(response.status).toBe(401);
    });

    it('should return 404 when product does not exist', async () => {
      const response = await request(app)
        .delete('/products/999')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});