const Joi = require('joi'); //validation package
const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  employeeId: Number,
  firstName: String,
  lastName: String,
  storeId: Number,
  position: String
}, { versionKey: false });
const Employee = mongoose.model('Employee', employeeSchema);

const schema = Joi.object({
  employeeId: Joi.number().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  storeId: Joi.string().required(),
  position: Joi.string().required()
}); //here we describe the schema of Joi

module.exports.schema = schema;
module.exports.Employee = Employee;
