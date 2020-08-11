const express = require('express');
const router = express.Router();
const validateId = require('../middleware/validateId');
const { Order, schema } = require('./orderSchema');

router.get('/', async (req, res) => {
  let selector = req.query.date?'date':req.query.employeeId?'employeeId':req.query.customerId?'customerId':req.query.orderTotal?'orderTotal':req.query.books?'books':null;
  let findVal = req.query.date?req.query.date:req.query.employeeId?req.query.employeeId:req.query.customerId?req.query.customerId:req.query.orderTotal?req.query.orderTotal:req.query.books?req.query.books:null;
  let orders = [];

  if(selector) {
    orders = await Order.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
    if(orders.length === 0) res.status(404).send('There is no orders with such parameters');
  }
  else {
    orders = await Order.find().sort({ [req.query.sortBy]: 1 });
  }
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
  try {
    let result = await order.save();
    res.send(result);
  }
  catch(e) {
    res.status(400).send(e.message);
  }

});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }
  try {
    let order = await Order.findOneAndUpdate({ "_id": req.params.id }, { ...req.body });
    if(!order) {
      res.status(400).send('There is no order with a chosen id');
      return;
    }
    res.send(order);
  }
  catch(e) {
    res.status(400).send(e.message);
  }
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
