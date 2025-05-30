const request = require('supertest');
const app = require('../server'); // Import the Express app instance

describe('Contacts Routes', () => {
  // Helper function to create a dummy user and log them in
  const loginUser = async (username, password) => {
    const agent = request.agent(app);
    await agent
      .post('/authentication/register')
      .field('username', username)
      .field('password', password);
      // .attach('profile_pic', 'path/to/dummy/pic.jpg')

    const loginRes = await agent
      .post('/authentication/login')
      .send({ username, password });

    return agent; // Return the agent with the logged-in session
  };

  // Test for adding a contact
  it('should add a contact for a logged-in user', async () => {
    const user1Agent = await loginUser('user1', 'password1');
    const user2Agent = await loginUser('user2', 'password2'); // User to be added as contact

    const res = await user1Agent
      .post('/contacts/addcontact')
      .send({ username: 'user2' }); // User1 adds User2 as contact

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Contact added!');

    // You might want to add assertions here to check the database to confirm the contact was added
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

  // Test for adding a group
  it('should create a new group and add members', async () => {
    const adminAgent = await loginUser('groupadmin', 'grouppassword');
    await loginUser('member1', 'member1password'); // User to be added to the group
    await loginUser('member2', 'member2password'); // Another user to be added to the group

    const res = await adminAgent
      .post('/contacts/addgroup')
      .send({ groupName: 'Test Group', members: ['member1', 'member2'] });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('group_id');

    // You might want to add assertions here to check the database to confirm the group and members were added
  });

   it('should return 401 if trying to create a group while unauthenticated', async () => {
      const res = await request(app)
       .post('/contacts/addgroup')
       .send({ groupName: 'Unauthorized Group', members: ['someuser'] });

     expect(res.statusCode).toBe(401);
     expect(res.body).toHaveProperty('message', 'Unauthorized');
   });
}); 