const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

let book = {
  id: 1,
  quantity: 1,
  cost: 100
};

const orders = [
  { id: 1, date: '01.01.2010', employeeId: '1', customerId: '1', orderTotal: '100', books: [book] },
  { id: 2, date: '01.01.2010', employeeId: '2', customerId: '2', orderTotal: '111', books: [book] },
  { id: 3, date: '01.01.2010', employeeId: '3', customerId: '3', orderTotal: '112', books: [book] }
];

const schema = Joi.object({
  date: Joi.date().required(),
  employeeId: Joi.number().required(),
  customerId: Joi.number().required(),
  orderTotal: Joi.number().required(),
  books: Joi.array().items()
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
    date: req.body.date,
    employeeId: req.body.employeeId,
    customerId: req.body.customerId,
    orderTotal: req.body.orderTotal,
    books: [
      ...req.body.books
    ]
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

  order.date = req.body.date;
  order.employeeId = req.body.employeeId;
  order.customerId = req.body.customerId;
  order.orderTotal = req.body.orderTotal;
  order.books = req.body.books;
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
