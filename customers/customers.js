const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package
const validateId = require('../middleware/validateId');

const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  tel: String,
  password: String
});
const Customer = mongoose.model('Customer', customerSchema);

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string(),
  tel: Joi.string().required(),
  password: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let selector = req.query.firstName?'firstName':req.query.lastName?'lastName':req.query.email?'email':req.query.tel?'tel':null;
  let findVal = req.query.firstName?req.query.firstName:req.query.lastName?req.query.lastName:req.query.email?req.query.email:req.query.tel?req.query.tel:null;
  let customers = [];
  if(selector) {
    customers = await Customer.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
    if(customers.length === 0) res.status(404).send('There is no customers with such parameters');
  }
  else {
    customers = await Customer.find().sort({ [req.query.sortBy]: 1 });
  }
  res.send(customers);
});
router.get('/:id', validateId, async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  if(!customer) res.status(404).send('There is no customer with such id');
  res.send(customer);
});

router.post('/', async (req, res) => {
  res.status(400).send("This route does not exists. To POST a new user please use '/auth' route");
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let customer = await Customer.findOneAndUpdate({"_id":req.params.id}, {...req.body});
  if(!customer) {
    res.status(400).send('There is no customer with a chosen id');
    return;
  }
  res.send(customer);
});

router.delete('/:id', validateId, async (req, res) => {
  let customer = await Customer.deleteOne({"_id": req.params.id});
  if(!customer) {
    res.status(400).send('There is no customer with a chosen id');
    return;
  }
  res.send(customer);
});

module.exports.router = router;
module.exports.Customer = Customer;
module.exports.schema = schema;
