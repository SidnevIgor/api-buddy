const Joi = require('joi'); //validation package
const mongoose = require('mongoose');
const storeSchema = new mongoose.Schema({
  city: String,
  street: String,
  building: String,
  postcode: String,
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }]
});
const Store = mongoose.model('Store', storeSchema);

const schema = Joi.object({
  city: Joi.string().required(),
  street: Joi.string().required(),
  building: Joi.string(),
  postcode: Joi.string().required(),
  employees: Joi.array().items(Joi.string())
}); //here we describe the schema of Joi

module.exports.schema = schema;
module.exports.Store = Store;