const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package
const validateId = require('../middleware/validateId');

const mongoose = require('mongoose');
const storeSchema = new mongoose.Schema({
  city: String,
  street: String,
  building: String,
  postcode: String
});
const Store = mongoose.model('Store', storeSchema);

const stores = [
  { id: 1, city: 'name1', street: 'lname1', building: 'test@gmail.com', postcode: '123-456-789', employees: [] },
  { id: 2, city: 'name2', street: 'lname2', building: 'test@gmail.com', postcode: '123-456-789', employees: [] },
  { id: 3, city: 'name3', street: 'lname3', building: 'test@gmail.com', postcode: '123-456-789', employees: [] }
];

const schema = Joi.object({
  city: Joi.string().required(),
  street: Joi.string().required(),
  building: Joi.string(),
  postcode: Joi.string().required(),
  employees: Joi.array().items(Joi.number())
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let stores = await Store.find();
  res.send(stores);
});
router.get('/:id', validateId, async (req, res) => {
  let store = await Store.findById(req.params.id);
  if(!store) res.status(404).send('There is no store with such id');
  res.send(store);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let store = new Store({...req.body});
  let result = await store.save();
  res.send(result);
});

router.put('/:id', validateId, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let store = await Store.findOneAndUpdate({ "_id": req.params.id }, { ...req.body });
  if(!store) {
    res.status(400).send('There is no store with a chosen id');
    return;
  }
  res.send(store);
});

router.delete('/:id', validateId, async (req, res) => {
  let store = await Store.deleteOne({"_id": req.params.id});
  if(!store) {
    res.status(400).send('There is no store with a chosen id');
    return;
  }
  res.send(store);
});

module.exports = router;
