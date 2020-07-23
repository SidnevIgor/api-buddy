const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

const books = [
  { id: 1, name: 'book1' },
  { id: 2, name: 'book2' },
  { id: 3, name: 'book3' },
];

const schema = Joi.object({
  name: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', (req, res) => {
  res.send(books);
});
router.get('/:id', (req, res) => {
  let book = books.find((c) => c.id === parseInt(req.params.id));
  if(!book) res.status(404).send('There is no book with such id');
  res.send(book);
});

router.post('/', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let book = {
    id: books.length + 1,
    name: req.body.name
  }
  books.push(book);
  res.send(book);
});

router.put('/:id', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let book = books.find((c) => c.id === parseInt(req.params.id));
  if(!book) {
    res.status(400).send('There is no book with a chosen id');
    return;
  }

  book.name = req.body.name;
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
