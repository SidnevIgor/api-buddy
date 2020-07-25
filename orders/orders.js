const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

const orders = [
  { id: 1, city: 'name1', street: 'lname1', building: 'test@gmail.com', postcode: '123-456-789', employees: [] },
  { id: 2, city: 'name2', street: 'lname2', building: 'test@gmail.com', postcode: '123-456-789', employees: [] },
  { id: 3, city: 'name3', street: 'lname3', building: 'test@gmail.com', postcode: '123-456-789', employees: [] }
];

const schema = Joi.object({
  city: Joi.string().required(),
  street: Joi.string().required(),
  building: Joi.string(),
  postcode: Joi.string().required(),
  employees: Joi.array().items(Joi.number())
}); //here we describe the schema of Joi


router.get('/', (req, res) => {
  res.send(orders);
});
router.get('/:id', (req, res) => {
  let order = orders.find((c) => c.id === parseInt(req.params.id));
  if(!order) res.status(404).send('There is no order with such id');
  res.send(order);
});

router.post('/', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let order = {
    id: orders.length + 1,
    city: req.body.city,
    street: req.body.street,
    building: req.body.building,
    postcode: req.body.postcode,
    employees: req.body.employees
  }
  orders.push(order);
  res.send(order);
});

router.put('/:id', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let order = orders.find((c) => c.id === parseInt(req.params.id));
  if(!order) {
    res.status(400).send('There is no order with a chosen id');
    return;
  }

  order.city = req.body.city;
  order.street = req.body.street;
  order.building = req.body.building;
  order.postcode = req.body.postcode;
  order.employees = req.body.employees;
  res.send(order);
});

router.delete('/:id', (req, res) => {
  let order = orders.find((c) => c.id === parseInt(req.params.id));
  if(!order) {
    res.status(400).send('There is no order with a chosen id');
    return;
  }

  let index = orders.indexOf(order);
  orders.splice(index, 1);
  res.send(order);
});

module.exports = router;
