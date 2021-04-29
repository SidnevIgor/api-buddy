const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const cleanResponse = require('../middleware/cleanResponse');

const { List, schema } = require('./listSchema');

router.get('/', async (req, res) => {
  let lists = await List.find({...req.query});
  if(lists.length === 0) return res.status(404).send('There is no lists with such parameters');

  return res.send(lists);
});
router.get('/:id', validateId, async (req, res) => {
  let list = await List.findOne({_id: req.params.id});
  if(!list) return res.status(404).send('There is no list with such id');
  return res.send(list);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let list = new List({...req.body});

  try {
    let result = await list.save();
    return res.send(result);
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
    let list = await List.findOneAndUpdate({ "_id": req.params.id }, { ...req.body });
    //let store = await Store.findOne({ "storeId": req.params.id });
    if(!list) {
      return res.status(404).send('There is no list with a chosen id');
    }
    return res.send(req.body);
  }
  catch(e) {
    return res.status(400).send(e.message);
  }
});

router.delete('/:id', validateId, async (req, res) => {
  let list = await List.deleteOne({"_id": req.params.id});
  //let store = await Store.findOne({ "storeId": req.params.id });
  if(!list) {
    return res.status(400).send('There is no list with a chosen id');
  }
  return res.send(list);
});

module.exports = router;
