const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); //this is required for checking authenticated users

const bcrypt = require('bcrypt'); //this is required for hashing passwords
const jwt = require('jsonwebtoken'); //this is used to generate token

const config = require('config'); //this is used to store hidden server variables

const mongoose = require('mongoose');
const {Customer, schema} = require('../customers/customers');

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let customer = await Customer.findOne({ 'email': req.body.email }); //check if user exists already

  if(!customer) { //this is a new client. need to register
    customer = new Customer({...req.body});
    let salt = await bcrypt.genSalt(10); //generate salt (addition to the password)
    customer.password = await bcrypt.hash(customer.password, salt); //generating hash
    let result = await customer.save();
  }
  else { // this is an old customer. need to check the password
    let match = await bcrypt.compare(req.body.password, customer.password);
    if(!match) return res.status(401).send("Wrong credentials");
  }

  let token = jwt.sign({_id: customer._id || result._id}, config.get('secret'));
  return res.status(200).send({
    'auth-token': token
  });
});

router.get('/me', auth, async (req, res) => {
  let customer = await Customer.findById(req.user._id);
  res.send(customer);
});

module.exports = router;
