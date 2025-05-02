const request = require('supertest');
const app = require('../app');
const { cleanUp, seed, getToken } = require('../helpers/jest');

describe('Admin Controller Endpoints', () => {
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

  // describe('GET /admin (Dashboard)', () => {
  //   it('should return dashboard info when admin is authenticated', async () => {
  //     const response = await request(app)
  //       .get('/admin')
  //       .set('Authorization', `Bearer ${adminToken}`);
      
  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('msg');
  //     expect(response.body).toHaveProperty('app_version');
  //   });

  //   it('should return 401 when not authenticated', async () => {
  //     const response = await request(app).get('/admin');
  //     expect(response.status).toBe(401);
  //   });

  //   it('should return 403 when non-admin tries to access dashboard', async () => {
  //     const response = await request(app)
  //       .get('/admin')
  //       .set('Authorization', `Bearer ${userToken}`);
      
  //     expect(response.status).toBe(403);
  //   });
  // });

  // describe('POST /admin/login', () => {
  //   it('should login successfully with valid admin credentials', async () => {
  //     const response = await request(app)
  //       .post('/admin/login')
  //       .send({ email: 'admin@mail.com', password: 'admin123' });
      
  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('access_token');
  //   });

  //   it('should return 401 with invalid email', async () => {
  //     const response = await request(app)
  //       .post('/admin/login')
  //       .send({ email: 'wrong@mail.com', password: 'admin123' });
      
  //     expect(response.status).toBe(401);
  //     expect(response.body).toHaveProperty('message', 'Invalid email/password');
  //   });

  //   it('should return 401 with invalid password', async () => {
  //     const response = await request(app)
  //       .post('/admin/login')
  //       .send({ email: 'admin@mail.com', password: 'wrongpassword' });
      
  //     expect(response.status).toBe(401);
  //     expect(response.body).toHaveProperty('message', 'Invalid email/password');
  //   });

  //   it('should return 400 with missing email and password', async () => {
  //     const response = await request(app)
  //       .post('/admin/login')
  //       .send({});
      
  //     expect(response.status).toBe(400);
  //     expect(response.body).toHaveProperty('message', 'Email or password is required');
  //   });
  // });

  describe('GET /admin/users', () => {
    it('should get all users when admin is authenticated', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('rows');
      expect(Array.isArray(response.body.rows)).toBe(true);
      expect(response.body.rows.length).toBeGreaterThan(0);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/admin/users');
      expect(response.status).toBe(401);
    });

    it('should return 403 when non-admin tries to access users', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(403);
    });
  });

  describe('GET /admin/me', () => {
    it('should get admin profile when authenticated', async () => {
      const response = await request(app)
        .get('/admin/me')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('id');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/admin/me');
      expect(response.status).toBe(401);
    });

    it('should return 403 when non-admin tries to access admin profile', async () => {
      const response = await request(app)
        .get('/admin/me')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(403);
    });
  });

  describe('PUT /admin/me/update', () => {
    it('should update admin profile successfully', async () => {
      const updatedProfile = {
        fullName: 'Updated Admin',
        email: 'updated.admin@mail.com'
      };
      
      const response = await request(app)
        .put('/admin/me/update')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedProfile);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user).toHaveProperty('fullName', 'Updated Admin');
      expect(response.body.user).toHaveProperty('email', 'updated.admin@mail.com');
    });

    it('should return 401 when not authenticated', async () => {
      const updatedProfile = { fullName: 'Updated Admin' };
      
      const response = await request(app)
        .put('/admin/me/update')
        .send(updatedProfile);
      
      expect(response.status).toBe(401);
    });

    it('should return 403 when non-admin tries to update admin profile', async () => {
      const updatedProfile = { fullName: 'Updated Admin' };
      
      const response = await request(app)
        .put('/admin/me/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedProfile);
      
      expect(response.status).toBe(403);
    });
  });
});