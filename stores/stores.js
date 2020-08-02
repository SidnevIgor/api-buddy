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

const schema = Joi.object({
  city: Joi.string().required(),
  street: Joi.string().required(),
  building: Joi.string(),
  postcode: Joi.string().required(),
  employees: Joi.array().items(Joi.number())
}); //here we describe the schema of Joi


router.get('/', async (req, res) => {
  let stores = await Store.find({city: [req.query.city], street: [req.query.street], building: [req.query.building]})
  .sort({ [req.query.sortBy]: 1 });
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
