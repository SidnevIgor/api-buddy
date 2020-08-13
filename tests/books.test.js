const request = require('supertest');
let server;

describe('/api/books', function() {
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(() => {
    server.close();
  });

  describe('GET all books', () => {
    it('should return all genres', async () => {
      let res = await request(server).get('/api/books');
      expect(res.status).toBe(200);
    });
  });
});
