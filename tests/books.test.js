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
      ]);
      let res = await request(server).get('/api/books');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
    it('should return a book with an additional parameter', async () => {
      await Book.collection.insertMany([
        {title: 't1', price: 100},
        {title: 't2', price: 200},
        {title: 't3', price: 300}
      ]);
      let res = await request(server).get('/api/books?price=200');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no book is found', async () => {
      await Book.collection.insertMany([
        {title: 't1', price: 100}
      ]);
      let res = await request(server).get('/api/books?price=200');
      expect(res.status).toBe(404);
    });
  });

  describe('GET one book', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/books/1234`);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/books/5f355ce806f38631fc33530d`);
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

  describe('POST one book', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/books',{
        title: 't1',
        price: 100
      });
      expect(res.status).toBe(400);
    });
  });
});
