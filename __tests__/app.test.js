const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
jest.mock('../lib/services/github');



describe('why-i-autha routes', () => {
  beforeEach(() => {
    return setup(pool);
  });



  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request 
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('DELETE should logout a user', async () => {
    const res = await request(app).delete('/api/v1/github/sessions');
    expect(res.body.message).toEqual('Signed out successfully!');
  });

  it('unauthenticated users are not able to see posts', async () => {
    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toEqual(401);
  });

  it('should return a list of posts', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42');

    const res = await agent.get('/api/v1/posts');

    expect(res.body.length).toEqual(3);
  });

  it('should allow user to create a new post', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42');

    const res = await agent.post('/api/v1/posts').send({ message: 'to err is human-to error is computer' });
    expect(res.body.message).toEqual('to err is human-to error is computer');
  });


  afterAll(() => {
    pool.end();
  });
});
