const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const cleanResponse = require('../middleware/cleanResponse');

const { Book, schema } = require('./bookSchema'); //here we create a class based on mongoose schema

router.get('/', async (req, res) => {
  let books = [];
  if(req.query) {
    books = await Book.find({ ...req.query }).sort({ [req.query.sortBy]: 1 });
    if(books.length === 0) return res.status(404).send('There is no books with such parameters');
  }
  else {
    books = await Book.find().sort({ [req.query.sortBy]: 1 });
  }
  return res.send(cleanResponse(books));
});
router.get('/:id', validateId, async (req, res) => {
  let book = await Book.find({ bookId: req.params.id });
  if(book.length === 0) return res.status(404).send('There is no book with such id');
  return res.send(cleanResponse(book));
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let book = new Book({...req.body});
  //const result = await book.save();
  return res.send(cleanResponse(book));
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }
  //let book = await Book.findOneAndUpdate({"bookId":req.params.id}, {...req.body});
  let book = await Book.find({"bookId":req.params.id});
  if(book.length === 0) {
    return res.status(400).send('There is no book with a chosen id');
  }
  return res.send(req.body);
});

router.delete('/:id', validateId, async (req, res) => {
  //let book = await Book.deleteOne({"bookId": req.params.id});
  let book = await Book.find({"bookId":req.params.id});
  if(book.length === 0) {
    return res.status(400).send('There is no book with a chosen id');
  }
  return res.send(book);
});

module.exports = router;
