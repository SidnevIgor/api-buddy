const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  storeId: Number,
  position: String
});

const employees = [
  { id: 1, firstName: 'Igor', lastName: 'Sidnev', storeId: 1, position: 'manager' },
  { id: 2, firstName: 'Egor', lastName: 'Tupchik', storeId: 2, position: 'manager' },
  { id: 3, firstName: 'Vgor', lastName: 'Larchik', storeId: 3, position: 'manager' }
];

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  storeId: Joi.number().required(),
  position: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', (req, res) => {
  res.send(employees);
});
router.get('/:id', (req, res) => {
  let employee = employees.find((c) => c.id === parseInt(req.params.id));
  if(!employee) res.status(404).send('There is no employee with such id');
  res.send(employee);
});

router.post('/', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let employee = {
    id: employees.length + 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    storeId: req.body.storeId,
    position: req.body.position
  }
  employees.push(employee);
  res.send(employee);
});

router.put('/:id', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let employee = employees.find((c) => c.id === parseInt(req.params.id));
  if(!employee) {
    res.status(400).send('There is no employee with a chosen id');
    return;
  }

  employee.firstName = req.body.firstName;
  employee.lastName = req.body.lastName;
  employee.storeId = req.body.storeId;
  employee.position = req.body.position;

  res.send(employee);
});

router.delete('/:id', (req, res) => {
  let employee = employees.find((c) => c.id === parseInt(req.params.id));
  if(!employee) {
    res.status(400).send('There is no employee with a chosen id');
    return;
  }

  let index = employees.indexOf(employee);
  employees.splice(index, 1);
  res.send(employee);
});

module.exports = router;
