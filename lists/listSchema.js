const Joi = require('joi'); //validation package
const mongoose = require('mongoose');
const listSchema = new mongoose.Schema({
  title: String,
  description: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  goals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }]
});
const List = mongoose.model('List', listSchema);

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  customerId: Joi.string().required(),
  goals: Joi.array().items(Joi.string())
}); //here we describe the schema of Joi

module.exports.schema = schema;
module.exports.List = List;
