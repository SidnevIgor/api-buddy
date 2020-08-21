const Joi = require('joi'); //validation package
const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  orderId: Number,
  date: String,
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  orderTotal: Number,
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
});
const Order = mongoose.model('Order', orderSchema);

const schema = Joi.object({
  orderId: Joi.number().required(),
  date: Joi.date().required(),
  employeeId: Joi.string().required(),
  customerId: Joi.string().required(),
  orderTotal: Joi.number().required(),
  books: Joi.array().items()
}); //here we describe the schema of Joi

module.exports.schema = schema;
module.exports.Order = Order;
