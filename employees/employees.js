const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package
const validateId = require('../middleware/validateId');

const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  storeId: Number,
  position: String
});
const Employee = mongoose.model('Employee', employeeSchema);

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  storeId: Joi.number().required(),
  position: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let selector = req.query.firstName?'firstName':req.query.lastName?'lastName':req.query.storeId?'storeId':req.query.position?'position':null;
  let findVal = req.query.firstName?req.query.firstName:req.query.lastName?req.query.lastName:req.query.storeId?req.query.storeId:req.query.position?req.query.position:null;
  let employees = [];
  if(selector) {
    employees = await Employee.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
    if(employees.length === 0) res.status(404).send('There is no employees with such parameters');
  }
  else {
    employees = await Employee.find().sort({ [req.query.sortBy]: 1 });
  }
  res.send(employees);
});
router.get('/:id', validateId, async (req, res) => {
  let employee = await Employee.findById(req.params.id);
  if(!employee) res.status(404).send('There is no employee with such id');
  res.send(employee);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let employee = new Employee({ ...req.body });
  let result = await employee.save();
  res.send(result);
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let employee = await Employee.findOneAndUpdate({ "_id": req.params.id }, {...req.body});
  if(!employee) {
    res.status(400).send('There is no employee with a chosen id');
    return;
  }
  res.send(employee);
});

router.delete('/:id', validateId, async (req, res) => {
  let employee = await Employee.deleteOne({"_id": req.params.id});
  if(!employee) {
    res.status(400).send('There is no employee with a chosen id');
    return;
  }
  res.send(employee);
});

module.exports = router;
