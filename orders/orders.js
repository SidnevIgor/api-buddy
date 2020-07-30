const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package
const validateId = require('../middleware/validateId');

const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  date: String,
  employeeId: Number,
  customerId: Number,
  orderTotal: Number
});
const Order = mongoose.model('Order', orderSchema);

let book = {
  id: 1,
  quantity: 1,
  cost: 100
};

const orders = [
  { id: 1, date: '01.01.2010', employeeId: 1, customerId: 1, orderTotal: 100, books: [book] },
  { id: 2, date: '01.01.2010', employeeId: 2, customerId: 2, orderTotal: 111, books: [book] },
  { id: 3, date: '01.01.2010', employeeId: 3, customerId: 3, orderTotal: 112, books: [book] }
];

const schema = Joi.object({
  date: Joi.date().required(),
  employeeId: Joi.number().required(),
  customerId: Joi.number().required(),
  orderTotal: Joi.number().required(),
  books: Joi.array().items()
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let orders = await Order.find();
  res.send(orders);
});
router.get('/:id', validateId, async (req, res) => {
  let order = await Order.findById(req.params.id);
  if(!order) res.status(404).send('There is no order with such id');
  res.send(order);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let order = new Order({...req.body});
  let result = await order.save();
  res.send(result);
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let order = await Order.findOneAndUpdate({ "_id": req.params.id }, { ...req.body });
  if(!order) {
    res.status(400).send('There is no order with a chosen id');
    return;
  }
  res.send(order);
});

router.delete('/:id', validateId, async (req, res) => {
  let order = await Order.deleteOne({"_id": req.params.id});
  if(!order) {
    res.status(400).send('There is no order with a chosen id');
    return;
  }
  res.send(order);
});

module.exports = router;
