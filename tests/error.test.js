const request = require('supertest');
let server;

describe('Testing error validation', () => {
  beforeEach(() => {
    if(!server) {
      server = require('../index');
    }
  });
  afterEach(async () => {
    server.close();
  });

  it('should catch an error', async () => {
    let res = await request(server).get('');
    expect(res.status).toBe(404);
  });
});
