const request = require('supertest');
const app = require('../server'); // Import the Express app instance
const path = require('path');
const fs = require('fs');

describe('User Profile Routes', () => {
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

  // Test for profile picture upload
  it('should upload a profile picture for a logged-in user', async () => {
    const agent = await loginUser('uploaduser', 'uploadpassword');

    // Create a dummy file to upload
    const dummyFilePath = path.join(__dirname, 'dummy.txt');
    fs.writeFileSync(dummyFilePath, 'This is a dummy file.');

    const res = await agent
      .post('/user/profile/edit/upload')
      .attach('profile_pic', dummyFilePath);

    // Clean up the dummy file
    fs.unlinkSync(dummyFilePath);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Upload successful');
    expect(res.body).toHaveProperty('user');
    // Add more assertions to check the user object and profile pic path if needed
  });

  it('should return 400 if no file is uploaded for profile picture', async () => {
     const agent = await loginUser('nouploaduser', 'nouploadpassword');

    const res = await agent
      .post('/user/profile/edit/upload');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'No file uploaded.');
  });

  // Test for fetching profile picture
  it('should return profile picture path for a logged-in user', async () => {
     const agent = await loginUser('fetchpicuser', 'fetchpicpassword');

    const res = await agent
      .get('/user/api/profile-pic');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('profilePic');
    // Add more assertions to check the format of the profilePic path if needed
  });

  it('should return default profile picture for unauthenticated user', async () => {
    const res = await request(app)
      .get('/user/api/profile-pic');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('profilePic', '/imgs/default-avatar.jpeg');
  });
}); 