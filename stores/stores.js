const express = require('express');
const router = express.Router();
const validateId = require('../middleware/validateId');
const { Store, schema } = require('./storeSchema');

router.get('/', async (req, res) => {
  let selector = req.query.city?'city':req.query.street?'street':req.query.building?'building':req.query.postcode?'postcode':req.query.employees?'employees':null;
  let findVal = req.query.city?req.query.city:req.query.street?req.query.street:req.query.building?req.query.building:req.query.postcode?req.query.postcode:req.query.employees?req.query.employees:null;
  let stores = [];
  if(selector) {
    stores = await Store.find({ [selector]: [findVal] }).sort({ [req.query.sortBy]: 1 });
    if(stores.length === 0) return res.status(404).send('There is no stores with such parameters');
  }
  else {
    stores = await Store.find().sort({ [req.query.sortBy]: 1 });
  }
  return res.send(stores);
});
router.get('/:id', validateId, async (req, res) => {
  let store = await Store.findById(req.params.id);
  if(!store) return res.status(404).send('There is no store with such id');
  return res.send(store);
});

router.post('/', async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let store = new Store({...req.body});

  try {
    let result = await store.save();
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
    let store = await Store.findOneAndUpdate({ "_id": req.params.id }, { ...req.body });
    if(!store) {
      return res.status(400).send('There is no store with a chosen id');
    }
    return res.send(store);
  }
  catch(e) {
    return res.status(400).send(e.message);
  }
});

router.delete('/:id', validateId, async (req, res) => {
  let store = await Store.deleteOne({"_id": req.params.id});
  if(store.deletedCount === 0) {
    return res.status(400).send('There is no store with a chosen id');
  }
  return res.send(store);
});

module.exports = router;
