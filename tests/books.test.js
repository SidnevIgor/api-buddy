const request = require('supertest');
let server;
const { Book } = require('../books/bookSchema');

describe('/api/books', function() {
  beforeEach(() => {
    server = require('../index');
  });
  afterEach(async () => {
    server.close();
    await Book.remove({});
  });

  describe('GET all books', () => {
    it('should return all books', async () => {
      await Book.collection.insertMany([
        {title: 't1'},
        {title: 't2'},
        {title: 't3'}
      ])
      let res = await request(server).get('/api/books');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
  });
  describe('GET one book', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/books/1234`);
      expect(res.status).toBe(404);
    });
    it('should retun one book', async () => {
      let book = new Book({
        title: 't1'
      })
      let bookSaved = await book.save();
      let res = await request(server).get(`/api/books/${bookSaved._id}`);
      expect(res.body.title).toMatch(bookSaved.title);
    });
  });
});
