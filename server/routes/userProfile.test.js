const request = require('supertest');
const app = require('../server');
const path = require('path');
const fs = require('fs');

describe('User Profile Routes', () => {
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

  it('should upload a profile picture for a logged-in user', async () => {
    const agent = await loginUser('uploaduser', 'uploadpassword');

    const dummyFilePath = path.join(__dirname, 'dummy.txt');
    fs.writeFileSync(dummyFilePath, 'This is a dummy file.');

    const res = await agent
      .post('/user/profile/edit/upload')
      .attach('profile_pic', dummyFilePath);

    fs.unlinkSync(dummyFilePath);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Upload successful');
    expect(res.body).toHaveProperty('user');
  });

  it('should return 400 if no file is uploaded for profile picture', async () => {
    const agent = await loginUser('nouploaduser', 'nouploadpassword');

    const res = await agent
      .post('/user/profile/edit/upload');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'No file uploaded.');
  });

  it('should return profile picture path for a logged-in user', async () => {
    const agent = await loginUser('fetchpicuser', 'fetchpicpassword');

    const res = await agent
      .get('/user/api/profile-pic');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('profilePic');
  });

  it('should return default profile picture for unauthenticated user', async () => {
    const res = await request(app)
      .get('/user/api/profile-pic');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('profilePic', '/imgs/default-avatar.jpeg');
  });
});
