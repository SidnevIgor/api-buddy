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
