const express = require('express');
const router = express.Router();
const validateId = require('../middleware/validateId');

const { Book, schema } = require('./bookSchema'); //here we create a class based on mongoose schema

router.get('/', async (req, res) => {
  let selector = req.query.title?'title':req.query.author?'author':req.query.genre?'genre':req.query.price?'price':req.query.issueDate?'issueDate':req.query.publisher?'publisher':null;
  let findVal = req.query.title?req.query.title:req.query.author?req.query.author:req.query.genre?req.query.genre:req.query.price?req.query.price:req.query.issueDate?req.query.issueDate:req.query.publisher?req.query.publisher:null;
  let books = [];
  if(selector) {
    books = await Book.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
    if(books.length === 0) return res.status(404).send('There is no books with such parameters');
  }
  else {
    books = await Book.find().sort({ [req.query.sortBy]: 1 });
  }
  return res.send(books);
});
router.get('/:id', validateId, async (req, res) => {
  let book = await Book.findById(req.params.id);
  if(!book) return res.status(404).send('There is no book with such id');
  return res.send(book);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let book = new Book({...req.body});
  const result = await book.save();
  return res.send(result);
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }
  let book = await Book.findOneAndUpdate({"_id":req.params.id}, {...req.body});
  if(!book) {
    return res.status(400).send('There is no book with a chosen id');
  }
  return res.send(book);
});

router.delete('/:id', validateId, async (req, res) => {
  let book = await Book.deleteOne({"_id": req.params.id});
  if(book.deletedCount === 0) {
    return res.status(400).send('There is no book with a chosen id');
  }
  return res.send(book);
});

module.exports = router;
