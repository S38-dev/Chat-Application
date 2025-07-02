const request = require('supertest');
const app = require('../server'); 

describe('Authentication Routes', () => {
 
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/authentication/register')
      .field('username', 'testuser')
      .field('password', 'testpassword')

    ;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Registration successful');
    expect(res.body).toHaveProperty('user');
   
  });

  it('should return 409 if user already exists during registration', async () => {
   
    await request(app)
      .post('/authentication/register')
      .field('username', 'existinguser')
      .field('password', 'password');
      

    const res = await request(app)
      .post('/authentication/register')
      .field('username', 'existinguser')
      .field('password', 'anotherpassword');
     

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'User exists');
  });

  
  it('should login an existing user', async () => {
 
     await request(app)
      .post('/authentication/register')
      .field('username', 'loginuser')
      .field('password', 'loginpassword');

    const res = await request(app)
      .post('/authentication/login')
      .send({ username: 'loginuser', password: 'loginpassword' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('user');
   
  });

  it('should return 401 for invalid login credentials', async () => {
    const res = await request(app)
      .post('/authentication/login')
      .send({ username: 'nonexistentuser', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

 
  it('should logout a logged-in user', async () => {
   
     const agent = request.agent(app);
     await agent
      .post('/authentication/register')
      .field('username', 'logoutuser')
      .field('password', 'logoutpassword');
      

    await agent
      .post('/authentication/login')
      .send({ username: 'logoutuser', password: 'logoutpassword' });

    const res = await agent
      .post('/authentication/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logout successful');
  });
}); 
