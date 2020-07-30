const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package
const validateId = require('../middleware/validateId');

const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  tel: String
});
const Customer = mongoose.model('Customer', customerSchema);

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string(),
  tel: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let customers = await Customer.find();
  res.send(customers);
});
router.get('/:id', validateId, async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  if(!customer) res.status(404).send('There is no customer with such id');
  res.send(customer);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let customer = new Customer({...req.body});
  let result = await customer.save();
  res.send(customer);
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

module.exports = router;
