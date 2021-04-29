const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');
const cleanResponse = require('../middleware/cleanResponse');

const { Goal, schema } = require('./goalSchema'); //here we create a class based on mongoose schema

router.get('/', auth, async (req, res) => {
  let goals = await Goal.find({ ...req.query });
  if(goals.length === 0) return res.status(404).send('There is no goals with such parameters');

  return res.send(goals);
});
router.get('/:id', auth, validateId, async (req, res) => {
  let goal = await Goal.findOne({_id: req.params.id});
  if(!goal) return res.status(404).send('There is no goal with such id');
  return res.send(goal);
});

router.post('/', auth, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let goal = new Goal({...req.body});
  const result = await goal.save();
  return res.send(result);
});

router.put('/:id', auth, validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    return res.status(400).send(validation.error);
  }
  let goal = await Goal.findOneAndUpdate({"_id":req.params.id}, {...req.body});
  //let book = await Book.findOne({"bookId":req.params.id});
  if(!goal) {
    return res.status(400).send('There is no goal with a chosen id');
  }
  return res.send(req.body);
});

router.delete('/:id', auth, validateId, async (req, res) => {
  let goal = await Goal.deleteOne({"_id": req.params.id});
  //let book = await Book.findOne({"bookId":req.params.id});
  if(!goal) {
    return res.status(400).send('There is no goal with a chosen id');
  }
  return res.send(goal);
});

module.exports = router;
