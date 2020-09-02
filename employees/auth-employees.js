const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');
const cleanResponse = require('../middleware/cleanResponse');

const { Employee, schema } = require('./employerSchema');

router.get('/', auth, async (req, res) => {
  let employees = [];
  if(req.query) {
    employees = await Employee.find({ ...req.query }).sort({ [req.query.sortBy]: 1 });
    if(employees.length === 0) return res.status(404).send('There is no employees with such parameters');
  }
  else {
    employees = await Employee.find().sort({ [req.query.sortBy]: 1 });
  }
  return res.send(cleanResponse(employees));
});
router.get('/:id', auth, validateId, async (req, res) => {
  let employee = await Employee.find({employeeId: req.params.id});
  if(!employee) return res.status(404).send('There is no employee with such id');
  return res.send(cleanResponse(employee));
});

router.post('/', auth, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let employee = new Employee({ ...req.body });

  try { //additional error validation
    let result = await employee.save();
    return res.send(cleanResponse(result));
  }
  catch(e) {
    return res.status(400).send(e.message);
  }
});

router.put('/:id', auth, validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }
  try {
    let employee = await Employee.findOneAndUpdate({ "employeeId": req.params.id }, {...req.body});
    if(!employee) {
      return res.status(400).send('There is no employee with a chosen id');
    }
    return res.send(req.body);
  }
  catch (e) {
    return res.status(400).send(e.message);
  }
});

router.delete('/:id', auth, validateId, async (req, res) => {
  let employee = await Employee.deleteOne({"employeeId": req.params.id});
  if(employee.deletedCount === 0) {
    return res.status(400).send('There is no employee with a chosen id');
  }
  return res.send(req.body);
});

module.exports = router;
