const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt'); //this is required for hashing passwords
const jwt = require('jsonwebtoken'); //this is used to generate token

const config = require('config'); //this is used to store hidden server variables

const mongoose = require('mongoose');
const {Customer, schema} = require('../customers/customers');

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let customer = await Customer.findOne({ 'email': req.body.email }); //check if user exists already
  let token = jwt.sign({_id: res._id}, config.get('secret'));

  if(!customer) {
    customer = new Customer({...req.body});
    let salt = await bcrypt.genSalt(10); //generate salt (addition to the password)
    customer.password = await bcrypt.hash(customer.password, salt); //generating hash
    let result = await customer.save();
  }
  res.header('x-auth-token', token).send({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    tel: customer.tel
  });
});


module.exports = router;
