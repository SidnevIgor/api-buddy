const Joi = require('joi'); //validation package
const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  position: String
});
const Employee = mongoose.model('Employee', employeeSchema);

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  storeId: Joi.string().required(),
  position: Joi.string().required()
}); //here we describe the schema of Joi

module.exports.schema = schema;
module.exports.Employee = Employee;
