const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');
const cleanResponse = require('../middleware/cleanResponse');

const { Order, schema } = require('./orderSchema');

router.get('/', auth, async (req, res) => {
  let orders = [];
  if(req.query) {
    orders = await Order.find({ ...req.query });
    if(orders.length === 0) return res.status(404).send('There is no orders with such parameters');
  }
  else {
    orders = await Order.find();
  }
  return res.send(cleanResponse(orders));
});
router.get('/:id', auth, validateId, async (req, res) => {
  let order = await Order.findOne({orderId: req.params.id});
  if(!order) return res.status(404).send('There is no order with such id');
  return res.send(cleanResponse(order));
});

router.post('/', auth, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }
  let order = new Order({...req.body});
  try {
    //let result = await order.save();
    return res.send(cleanResponse(order));
  }
  catch(e) {
    return res.status(400).send(e.message);
  }
});

router.put('/:id', auth, validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }
  try {
    //let order = await Order.findOneAndUpdate({ "orderId": req.params.id }, { ...req.body });
    let order = await Order.findOne({ "orderId": req.params.id });
    if(!order) {
      return res.status(400).send('There is no order with a chosen id');
    }
    return res.send(req.body);
  }
  catch(e) {
    return res.status(400).send(e.message);
  }
});

router.delete('/:id', auth, validateId, async (req, res) => {
  //let order = await Order.deleteOne({"orderId": req.params.id});
  let order = await Order.findOne({ "orderId": req.params.id });
  if(!order) {
    return res.status(400).send('There is no order with a chosen id');
  }
  return res.send(order);
});

module.exports = router;
