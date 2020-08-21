const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({ //here we create a mongoose schema
  bookId: Number,
  title: String,
  author: String,
  genre: String,
  price: Number,
  issueDate: { type: Date, default: Date.now },
  publisher: String
});

const Book = mongoose.model('Book', bookSchema); //here we create a class based on mongoose schema

const Joi = require('joi'); //validation package

const schema = Joi.object({
  bookId: Joi.number().required(),
  title: Joi.string().required(),
  author: Joi.string().required().pattern(new RegExp('^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$')),
  genre: Joi.string().required(),
  price: Joi.number().required(),
  issueDate: Joi.date().required(),
  publisher: Joi.string().required()
}); //here we describe the schema of Joi

module.exports.Book = Book;
module.exports.schema = schema;
