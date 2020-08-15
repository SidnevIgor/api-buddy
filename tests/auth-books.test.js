const request = require('supertest');
const config = require('config'); //this is used to store hidden server variables

let server, customer, token, result;
const { Book } = require('../books/bookSchema');
const { Customer } = require('../customers/customers');

describe('/api/books', function() {
  beforeEach( async () => {
    server = require('../index');
    customer = new Customer({
      firstName: "name5",
      lastName: "lname4",
      email: "test@gmail.com",
      tel: "123-456-789"
    });
    result = await customer.save();
    token = jwt.sign({_id: result._id}, config.get('secret'));
  });
  afterEach(async () => {
    server.close();
    await Book.remove({});
  });

  describe('GET all books', () => {
    it('should return 401 error', async () => {
      await Book.collection.insertMany([
        {title: 't1'},
        {title: 't2'},
        {title: 't3'}
      ]);
      let res = await request(server).get('/api/books');
      expect(res.status).toBe(401);
    });
    it('should return all books', async () => {
      await Book.collection.insertMany([
        {title: 't1'},
        {title: 't2'},
        {title: 't3'}
      ]);
      let res = await request(server).get('/api/books').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
    it('should return a book with an additional parameter', async () => {
      await Book.collection.insertMany([
        {title: 't1', price: 100},
        {title: 't2', price: 200},
        {title: 't3', price: 300}
      ]);
      let res = await request(server).get('/api/books?price=200').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no book is found', async () => {
      await Book.collection.insertMany([
        {title: 't1', price: 100}
      ]);
      let res = await request(server).get('/api/books?price=200').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
  });

  describe('GET one book', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/books/1234`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/books/5f355ce806f38631fc33530d`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should retun one book', async () => {
      let book = new Book({
        title: 't1'
      })
      let bookSaved = await book.save();
      let res = await request(server).get(`/api/books/${bookSaved._id}`).set('x-auth-token', token);
      expect(res.body.title).toMatch(bookSaved.title);
    });
  });

  describe('POST one book', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/books').set('x-auth-token', token).send({
        title: 't1',
        price: 100
      });
      expect(res.status).toBe(400);
    });
    it('should post a book', async () => {
      let book = {
        title: "book9",
        author: "Leo Tolstoy",
        genre: "Romance",
        price: 100,
        issueDate: "2020",
        publisher: "Alpina"
      };
      let res = await request(server).post('/api/books').set('x-auth-token', token).send({...book});
      expect(res.body.title).toMatch(book.title);
    });
  });

  describe('PUT one book', () => {
    it('should throw an error when id is invalid', async () => {
      let book = {
        title: "book9",
        author: "Leo Tolstoy",
        genre: "Romance",
        price: 100,
        issueDate: "2020",
        publisher: "Alpina"
      };
      let res = await request(server).put(`/api/books/1234`).set('x-auth-token', token).send(book);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let book = {
        title: "book9"
      };
      let res = await request(server).put(`/api/books/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(book);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let book = {
        title: "book9",
        author: "Leo Tolstoy",
        genre: "Romance",
        price: 100,
        issueDate: "2020",
        publisher: "Alpina"
      };
      let res = await request(server).put(`/api/books/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(book);
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let book = {
        title: "book9",
        author: "Leo Tolstoy",
        genre: "Romance",
        price: 100,
        issueDate: "2020",
        publisher: "Alpina"
      };
      let savedBook = await Book.collection.insertMany([{...book}]);

      let res = await request(server).put(`/api/books/${savedBook.ops[0]._id}`).set('x-auth-token', token).send({
        title: "book9",
        author: "Leo Tolstoy",
        genre: "Romance",
        price: 300,
        issueDate: "2020",
        publisher: "Alpina"
      });
      expect(res.body.price).toEqual(100);
    });
  });

  describe('DELETE one book', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/books/1234').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/books/5f2178c4b1ef5441280c2366').set('x-auth-token', token);
      expect(res.body.deletedCount).toBe(0);
    });
    it('should delete one book', async () => {
      let book = {
        title: "book9",
        author: "Leo Tolstoy",
        genre: "Romance",
        price: 100,
        issueDate: "2020",
        publisher: "Alpina"
      };
      let savedBook = await Book.collection.insertMany([{...book}]);

      let res = await request(server).delete(`/api/books/${savedBook.ops[0]._id}`).set('x-auth-token', token);
      expect(res.body.deletedCount).toBe(1);
    });
  })
});
