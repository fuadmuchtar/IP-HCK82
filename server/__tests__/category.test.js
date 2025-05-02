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
});