const request = require('supertest');
const app = require('../app');
const { cleanUp, seed, getToken } = require('../helpers/jest');
const { User } = require('../models');

describe('Public Controller Endpoints', () => {
  let userToken;

  beforeAll(async () => {
    await cleanUp();
    await seed();
    userToken = await getToken('user@mail.com', 'user123', false);
  });

  afterAll(async () => {
    await cleanUp();
  });

  describe('GET / (Home Page)', () => {
    it('should return homepage info', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('msg');
      expect(response.body).toHaveProperty('app_version');
    });
  });

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'user@mail.com', password: 'user123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 401 with invalid email', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'wrong@mail.com', password: 'user123' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email/password');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'user@mail.com', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email/password');
    });

    it('should return 400 with missing email and password', async () => {
      const response = await request(app)
        .post('/login')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email or password is required');
    });
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        fullName: 'Test User',
        email: 'newuser@mail.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/register')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', 'newuser@mail.com');
      expect(response.body).toHaveProperty('fullName', 'Test User');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 when validation fails (missing data)', async () => {
      const incompleteUser = {
        email: 'incomplete@mail.com'
        // Missing required fields
      };
      
      const response = await request(app)
        .post('/register')
        .send(incompleteUser);
      
      expect(response.status).toBe(400);
    });

    it('should return 400 when email already exists', async () => {
      // We've already registered a user with this email in the previous test
      const existingUser = {
        fullName: 'Duplicate User',
        email: 'user@mail.com', // This email already exists in the seeded data
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/register')
        .send(existingUser);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email');
    });
  });

  describe('GET /profile', () => {
    it('should get user profile when authenticated', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'user@mail.com');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/profile');
      expect(response.status).toBe(401);
    });

    it('should return 404 when user does not exist', async () => {
      // Create token with non-existent user ID
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5LCJpYXQiOjE2MTk4NTI5NzJ9.2mlo30ZgL4BFUClZeURJzxKxKUQJFIVyOJNV3f1l1uE';
      
      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${fakeToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /profile/update', () => {
    it('should update user profile successfully', async () => {
      const updatedProfile = {
        fullName: 'Updated User',
        address: '123 Test Street',
        phoneNumber: '08123456789'
      };
      
      const response = await request(app)
        .put('/profile/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedProfile);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fullName', 'Updated User');
      expect(response.body).toHaveProperty('address', '123 Test Street');
      expect(response.body).toHaveProperty('phoneNumber', '08123456789');
    });

    it('should return 401 when not authenticated', async () => {
      const updatedProfile = { fullName: 'Updated User' };
      
      const response = await request(app)
        .put('/profile/update')
        .send(updatedProfile);
      
      expect(response.status).toBe(401);
    });
  });

  describe('POST /exploreindonesia', () => {
    it('should return AI-powered info about Indonesia', async () => {
      // Mocking the genai helper so we don't depend on external API in tests
      jest.mock('../helpers/genai', () => ({
        genai: jest.fn().mockResolvedValue('This is information about Borobudur temple in Indonesia')
      }));

      const response = await request(app)
        .post('/exploreindonesia')
        .send({ query: 'Tell me about Borobudur temple' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('query');
      expect(response.body).toHaveProperty('result');
    });

    it('should return 400 when query is missing', async () => {
      const response = await request(app)
        .post('/exploreindonesia')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Query is required');
    });
  });
});