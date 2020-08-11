const express = require('express');
const router = express.Router();
const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');

const { Customer, schema } = require('./customerSchema');


router.get('/', auth, async (req, res) => {
  let selector = req.query.firstName?'firstName':req.query.lastName?'lastName':req.query.email?'email':req.query.tel?'tel':null;
  let findVal = req.query.firstName?req.query.firstName:req.query.lastName?req.query.lastName:req.query.email?req.query.email:req.query.tel?req.query.tel:null;
  let customers = [];
  if(selector) {
    customers = await Customer.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
    if(customers.length === 0) return res.status(404).send('There is no customers with such parameters');
  }
  else {
    customers = await Customer.find().sort({ [req.query.sortBy]: 1 });
  }
  return res.send(customers);
});
router.get('/:id', auth, validateId, async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  if(!customer) return res.status(404).send('There is no customer with such id');
  return res.send(customer);
});

router.post('/', auth, async (req, res) => {
  return res.status(400).send("This route does not exists. To POST a new user please use '/auth' route");
});

router.put('/:id', auth, validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }

  let customer = await Customer.findOneAndUpdate({"_id":req.params.id}, {...req.body});
  if(!customer) {
    return res.status(400).send('There is no customer with a chosen id');
  }
  return res.send(customer);
});

router.delete('/:id', auth, validateId, async (req, res) => {
  let customer = await Customer.deleteOne({"_id": req.params.id});
  if(!customer) {
    return res.status(400).send('There is no customer with a chosen id');
  }
  return res.send(customer);
});

module.exports.router = router;
module.exports.Customer = Customer;
module.exports.schema = schema;