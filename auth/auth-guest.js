const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); //this is required for checking authenticated users

const bcrypt = require('bcrypt'); //this is required for hashing passwords
const jwt = require('jsonwebtoken'); //this is used to generate token

const config = require('config'); //this is used to store hidden server variables

const mongoose = require('mongoose');
const { Customer } = require('../customers/customers');

router.post('/', async (req, res) => {
  let customer = new Customer({...req.body});
  let salt = await bcrypt.genSalt(10); //generate salt (addition to the password)
  customer.password = await bcrypt.hash(customer.password, salt); //generating hash
  let result = await customer.save();

  let token = jwt.sign({_id: customer._id || result._id}, config.get('secret'));
  return res.status(200).send({
    'auth-token': token
  });
});

module.exports = router;
