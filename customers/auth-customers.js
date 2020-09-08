const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');
const cleanResponse = require('../middleware/cleanResponse');

const { Customer, schema } = require('./customerSchema');


router.get('/', auth, async (req, res) => {
  let customers = [];
  if(req.query) {
    customers = await Customer.find({ ...req.query });
    if(customers.length === 0) return res.status(404).send('There is no customers with such parameters');
  }
  else {
    customers = await Customer.find();
  }
  return res.send(cleanResponse(customers));
});
router.get('/:id', auth, validateId, async (req, res) => {
  let customer = await Customer.findOne({customerId: req.params.id});
  if(!customer) return res.status(404).send('There is no customer with such id');
  return res.send(cleanResponse(customer));
});

router.post('/', auth, async (req, res) => {
  return res.status(400).send("This route does not exists. To POST a new user please use '/auth' route");
});

router.put('/:id', auth, validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }

  //let customer = await Customer.findOneAndUpdate({"customerId":req.params.id}, {...req.body});
  let customer = await Customer.findOne({"customerId":req.params.id});
  if(!customer) {
    return res.status(400).send('There is no customer with a chosen id');
  }
  return res.send(req.body);
});

router.delete('/:id', auth, validateId, async (req, res) => {
  //let customer = await Customer.deleteOne({"customerId": req.params.id});
  let customer = await Customer.findOne({"customerId":req.params.id});
  if(!customer) {
    return res.status(400).send('There is no customer with a chosen id');
  }
  return res.send(customer);
});

module.exports.router = router;
module.exports.Customer = Customer;
module.exports.schema = schema;
