
const request = require('supertest');
const app = require('../server');

describe('Contacts Routes', () => {
  const loginUser = async (username, password) => {
    const agent = request.agent(app);
    await agent
      .post('/authentication/register')
      .field('username', username)
      .field('password', password);

    const loginRes = await agent
      .post('/authentication/login')
      .send({ username, password });

    return agent;
  };

  it('should add a contact for a logged-in user', async () => {
    const user1Agent = await loginUser('user1', 'password1');
    const user2Agent = await loginUser('user2', 'password2');

    const res = await user1Agent
      .post('/contacts/addcontact')
      .send({ username: 'user2' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Contact added!');
  });

  it('should return 404 if user to be added as contact does not exist', async () => {
    const user1Agent = await loginUser('user3', 'password3');

    const res = await user1Agent
      .post('/contacts/addcontact')
      .send({ username: 'nonexistentuser' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found.');
  });

  it('should return 401 if trying to add a contact while unauthenticated', async () => {
    const res = await request(app)
      .post('/contacts/addcontact')
      .send({ username: 'someuser' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should create a new group and add members', async () => {
    const adminAgent = await loginUser('groupadmin', 'grouppassword');
    await loginUser('member1', 'member1password');
    await loginUser('member2', 'member2password');

    const res = await adminAgent
      .post('/contacts/addgroup')
      .send({ groupName: 'Test Group', members: ['member1', 'member2'] });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('group_id');
  });

  it('should return 401 if trying to create a group while unauthenticated', async () => {
    const res = await request(app)
      .post('/contacts/addgroup')
      .send({ groupName: 'Unauthorized Group', members: ['someuser'] });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
