const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

const customers = [
  { id: 1, firstName: 'name1', lastName: 'lname1', email: 'test@gmail.com', tel: '123-456-789' },
  { id: 2, firstName: 'name2', lastName: 'lname2', email: 'test@gmail.com', tel: '123-456-789' },
  { id: 3, firstName: 'name3', lastName: 'lname3', email: 'test@gmail.com', tel: '123-456-789' }
];

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.email(),
  tel: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', (req, res) => {
  res.send(customers);
});
router.get('/:id', (req, res) => {
  let customer = customers.find((c) => c.id === parseInt(req.params.id));
  if(!customer) res.status(404).send('There is no customer with such id');
  res.send(customer);
});

router.post('/', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let customer = {
    id: customers.length + 1,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    issueDate: req.body.issueDate,
    publisher: req.body.publisher
  }
  customers.push(customer);
  res.send(customer);
});

router.put('/:id', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let customer = customers.find((c) => c.id === parseInt(req.params.id));
  if(!customer) {
    res.status(400).send('There is no customer with a chosen id');
    return;
  }

  customer.title = req.body.title;
  res.send(customer);
});

router.delete('/:id', (req, res) => {
  let customer = customers.find((c) => c.id === parseInt(req.params.id));
  if(!customer) {
    res.status(400).send('There is no customer with a chosen id');
    return;
  }

  let index = customers.indexOf(customer);
  customers.splice(index, 1);
  res.send(customer);
});

module.exports = router;
