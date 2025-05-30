const request = require('supertest');
const app = require('../server'); // Import the Express app instance

describe('Authentication Routes', () => {
  // Test for user registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/authentication/register')
      .field('username', 'testuser')
      .field('password', 'testpassword')
      // You might need to attach a dummy profile picture file if the route requires it
      // .attach('profile_pic', 'path/to/dummy/pic.jpg')
    ;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Registration successful');
    expect(res.body).toHaveProperty('user');
    // Add more assertions to check the structure of the user object if needed
  });

  it('should return 409 if user already exists during registration', async () => {
    // First, register the user
    await request(app)
      .post('/authentication/register')
      .field('username', 'existinguser')
      .field('password', 'password');
      // .attach('profile_pic', 'path/to/dummy/pic.jpg')

    // Then, try to register the same user again
    const res = await request(app)
      .post('/authentication/register')
      .field('username', 'existinguser')
      .field('password', 'anotherpassword');
      // .attach('profile_pic', 'path/to/dummy/pic.jpg')

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'User exists');
  });

  // Test for user login
  it('should login an existing user', async () => {
    // First, register a user to login with
     await request(app)
      .post('/authentication/register')
      .field('username', 'loginuser')
      .field('password', 'loginpassword');
      // .attach('profile_pic', 'path/to/dummy/pic.jpg')

    const res = await request(app)
      .post('/authentication/login')
      .send({ username: 'loginuser', password: 'loginpassword' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('user');
     // Add more assertions to check the structure of the user object if needed
  });

  it('should return 401 for invalid login credentials', async () => {
    const res = await request(app)
      .post('/authentication/login')
      .send({ username: 'nonexistentuser', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  // Test for user logout
  it('should logout a logged-in user', async () => {
     // First, login a user to logout
     const agent = request.agent(app);
     await agent
      .post('/authentication/register')
      .field('username', 'logoutuser')
      .field('password', 'logoutpassword');
       // .attach('profile_pic', 'path/to/dummy/pic.jpg')

    await agent
      .post('/authentication/login')
      .send({ username: 'logoutuser', password: 'logoutpassword' });

    const res = await agent
      .post('/authentication/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logout successful');
  });
}); 