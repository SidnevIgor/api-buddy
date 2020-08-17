const Joi = require('joi'); //validation package
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
  lastName: Joi.string(),
  email: Joi.string(),
  tel: Joi.string().required(),
  password: Joi.string().required()
}); //here we describe the schema of Joi

module.exports.Customer = Customer;
module.exports.schema = schema;
