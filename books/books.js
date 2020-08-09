const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({ //here we create a mongoose schema
  title: String,
  author: String,
  genre: String,
  price: Number,
  issueDate: { type: Date, default: Date.now },
  publisher: String
});

const Book = mongoose.model('Book', bookSchema); //here we create a class based on mongoose schema

const Joi = require('joi'); //validation package
const validateId = require('../middleware/validateId');

const schema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required().pattern(new RegExp('^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$')),
  genre: Joi.string().required(),
  price: Joi.number().required(),
  issueDate: Joi.date().required(),
  publisher: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let selector = req.query.title?'title':req.query.author?'author':req.query.genre?'genre':req.query.price?'price':req.query.issueDate?'issueDate':req.query.publisher?'publisher':null;
  let findVal = req.query.title?req.query.title:req.query.author?req.query.author:req.query.genre?req.query.genre:req.query.price?req.query.price:req.query.issueDate?req.query.issueDate:req.query.publisher?req.query.publisher:null;
  let books = [];
  try {
    if(selector) {
      books = await Book.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
      if(books.length === 0) res.status(404).send('There is no books with such parameters');
    }
    else {
      books = await Book.find().sort({ [req.query.sortBy]: 1 });
    }
    res.send(books);
  }
  catch(ex) {
    res.status(500).send('The server is unavailable'); return;
  }
});
router.get('/:id', validateId, async (req, res) => {
  let book = await Book.findById(req.params.id);
  if(!book) res.status(404).send('There is no book with such id');
  res.send(book);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let book = new Book({...req.body});
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

router.delete('/:id', async (req, res) => {
  let book = await Book.deleteOne({"_id": req.params.id});
  if(!book) {
    res.status(400).send('There is no book with a chosen id');
    return;
  }
  res.send(book);
});

module.exports = router;
