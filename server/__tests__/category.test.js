const request = require('supertest');
const app = require('../app');
const { cleanUp, seed, getToken } = require('../helpers/jest');

describe('Category Endpoints', () => {
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

  describe('GET /categories', () => {
    it('should get all categories', async () => {
      const response = await request(app).get('/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /categories (Admin only)', () => {
    it('should create a new category when admin is authenticated', async () => {
      const newCategory = {
        name: 'Test Category'
      };
      
      const response = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCategory);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Test Category');
      expect(response.body).toHaveProperty('id');
    });

    it('should return 401 when no token is provided', async () => {
      const newCategory = {
        name: 'Test Category'
      };
      
      const response = await request(app)
        .post('/categories')
        .send(newCategory);
      
      expect(response.status).toBe(401);
    });

    it('should return 403 when non-admin tries to create a category', async () => {
      const newCategory = {
        name: 'Test Category'
      };
      
      const response = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCategory);
      
      expect(response.status).toBe(403);
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /categories/:id (Admin only)', () => {
    it('should update a category when admin is authenticated', async () => {
      const updatedCategory = {
        name: 'Updated Category'
      };
      
      const response = await request(app)
        .put('/categories/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedCategory);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Category');
      expect(response.body).toHaveProperty('id', 1);
    });

    it('should return 401 when no token is provided', async () => {
      const updatedCategory = {
        name: 'Updated Category'
      };
      
      const response = await request(app)
        .put('/categories/1')
        .send(updatedCategory);
      
      expect(response.status).toBe(401);
    });

    it('should return 403 when non-admin tries to update a category', async () => {
      const updatedCategory = {
        name: 'Updated Category'
      };
      
      const response = await request(app)
        .put('/categories/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedCategory);
      
      expect(response.status).toBe(403);
    });

    it('should return 404 when category does not exist', async () => {
      const updatedCategory = {
        name: 'Updated Category'
      };
      
      const response = await request(app)
        .put('/categories/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedCategory);
      
      expect(response.status).toBe(404);
    });
  });
});