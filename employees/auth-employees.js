const express = require('express');
const router = express.Router();
const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');

const { Employee, schema } = require('./employerSchema');

router.get('/', auth, async (req, res) => {
  let selector = req.query.firstName?'firstName':req.query.lastName?'lastName':req.query.storeId?'storeId':req.query.position?'position':null;
  let findVal = req.query.firstName?req.query.firstName:req.query.lastName?req.query.lastName:req.query.storeId?req.query.storeId:req.query.position?req.query.position:null;
  let employees = [];
  if(selector) {
    employees = await Employee.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
    if(employees.length === 0) return res.status(404).send('There is no employees with such parameters');
  }
  else {
    employees = await Employee.find().sort({ [req.query.sortBy]: 1 });
  }
  return res.send(employees);
});
router.get('/:id', auth, validateId, async (req, res) => {
  let employee = await Employee.findById(req.params.id);
  if(!employee) return res.status(404).send('There is no employee with such id');
  return res.send(employee);
});

router.post('/', auth, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let employee = new Employee({ ...req.body });

  try { //additional error validation
    let result = await employee.save();
    return res.send(result);
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
    let employee = await Employee.findOneAndUpdate({ "_id": req.params.id }, {...req.body});
    if(!employee) {
      return res.status(400).send('There is no employee with a chosen id');
    }
    return res.send(employee);
  }
  catch (e) {
    return res.status(400).send(e.message);
  }
});

router.delete('/:id', auth, validateId, async (req, res) => {
  let employee = await Employee.deleteOne({"_id": req.params.id});
  if(employee.deletedCount === 0) {
    return res.status(400).send('There is no employee with a chosen id');
  }
  return res.send(employee);
});

module.exports = router;
