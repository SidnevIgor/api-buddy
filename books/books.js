const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({ //here we create a mongoose schema
  title: String,
  author: String,
  genre: String,
  issueDate: { type: Date, default: Date.now },
  publisher: String
});

const Book = mongoose.model('Book', bookSchema); //here we create a class based on mongoose schema

const Joi = require('joi'); //validation package
const validateId = require('../middleware/validateId');

const books = [
  { id: 1, title: 'book1', author: 'auth1', genre: 'Romance', issueDate: '10.10.2020', publisher: 'Alpina' },
  { id: 2, title: 'book2', author: 'auth2', genre: 'Romance', issueDate: '11.10.2020', publisher: 'Alpina' },
  { id: 3, title: 'book3', author: 'auth3', genre: 'Romance', issueDate: '12.10.2020', publisher: 'Alpina' },
];

const schema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required().pattern(new RegExp('^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$')),
  genre: Joi.string().required(),
  issueDate: Joi.date().required(),
  publisher: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let books = await Book.find();
  res.send(books);
});
router.get('/:id', validateId, async (req, res) => {
  let book = await Book.findById(req.params.id);
  if(!book) res.status(404).send('There is no book with such id');
  res.send(book);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let book = new Book({
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    issueDate: req.body.issueDate,
    publisher: req.body.publisher
  });
  const result = await book.save();
  res.send(result);
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }
  let book = await Book.findOneAndUpdate({"_id":req.params.id}, {...req.body});
  if(!book) {
    res.status(400).send('There is no book with a chosen id');
    return;
  }
  res.send(book);
});

router.delete('/:id', (req, res) => {
  let book = books.find((c) => c.id === parseInt(req.params.id));
  if(!book) {
    res.status(400).send('There is no book with a chosen id');
    return;
  }

  let index = books.indexOf(book);
  books.splice(index, 1);
  res.send(book);
});

module.exports = router;
