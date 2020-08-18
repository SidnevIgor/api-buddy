const request = require('supertest');

let server;

describe('Testing auth validation', () => {
  beforeEach( async () => {
    if(!server) {
      server = require('../index');
    }
  });
  afterEach( async () => {
    server.close();
  });

  it('should return return a 404 error', async () => {
    let res = await request(server).get('/');
    expect(res.status).toBe(404);
  });
  it('should return return a 404 error', async () => {
    let res = await request(server).put('/');
    expect(res.status).toBe(404);
  });
  it('should return return a 404 error', async () => {
    let res = await request(server).post('/');
    expect(res.status).toBe(404);
  });
  it('should return return a 404 error', async () => {
    let res = await request(server).delete('/');
    expect(res.status).toBe(404);
  });
});
