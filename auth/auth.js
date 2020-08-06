const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const {Customer, schema} = require('../customers/customers');

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let customer = await Customer.findOne({ 'email': req.body.email }); //check if user exists already
  if(customer) {
    res.status(400).send('User with such email already exists');
  }
  else {
    let customer = new Customer({...req.body});
    let result = await customer.save();
    res.send({
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      tel: result.tel
    });
  }
});


module.exports = router;
