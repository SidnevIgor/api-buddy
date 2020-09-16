const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const cleanResponse = require('../middleware/cleanResponse');

const { Employee, schema } = require('./employerSchema');

router.get('/', async (req, res) => {
  let employees = await Employee.find({ ...req.query });
  if(employees.length === 0) return res.status(404).send('There is no employees with such parameters');

  return res.send(cleanResponse(employees));
});
router.get('/:id', validateId, async (req, res) => {
  let employee = await Employee.findOne({employeeId: req.params.id});
  if(!employee) return res.status(404).send('There is no employee with such id');
  return res.send(cleanResponse(employee));
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let employee = new Employee({ ...req.body });

  try { //additional error validation
    //let result = await employee.save();
    return res.send(cleanResponse(employee));
  }
  catch(e) {
    return res.status(400).send(e.message);
  }
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }
  try {
    //let employee = await Employee.findOneAndUpdate({ "employeeId": req.params.id }, {...req.body});
    let employee = await Employee.findOne({ "employeeId": req.params.id });
    if(!employee) {
      return res.status(400).send('There is no employee with a chosen id');
    }
    return res.send(req.body);
  }
  catch (e) {
    return res.status(400).send(e.message);
  }
});

router.delete('/:id', validateId, async (req, res) => {
  //let employee = await Employee.deleteOne({"employeeId": req.params.id});
  let employee = await Employee.findOne({ "employeeId": req.params.id });
  if(!employee) {
    return res.status(400).send('There is no employee with a chosen id');
  }
  return res.send(cleanResponse(employee));
});

module.exports = router;
module.exports.Employee = Employee;
