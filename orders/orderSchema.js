const Joi = require('joi'); //validation package
const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  orderId: Number,
  date: String,
  employeeId: Number,
  customerId: Number,
  orderTotal: Number,
  books: [{
    type: Number
  }]
}, { versionKey: false });
const Order = mongoose.model('Order', orderSchema);

const schema = Joi.object({
  orderId: Joi.number().required(),
  date: Joi.date().required(),
  employeeId: Joi.number().required(),
  customerId: Joi.number().required(),
  orderTotal: Joi.number().required(),
  books: Joi.array().items(Joi.number())
}); //here we describe the schema of Joi

module.exports.schema = schema;
module.exports.Order = Order;
