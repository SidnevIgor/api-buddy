const express = require('express');
const router = express.Router();

const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');
const cleanResponse = require('../middleware/cleanResponse');

const { Store, schema } = require('./storeSchema');

router.get('/', auth, async (req, res) => {
  let stores = await Store.find({ ...req.query });
  if(stores.length === 0) return res.status(404).send('There is no stores with such parameters');

  return res.send(cleanResponse(stores));
});
router.get('/:id', auth, validateId, async (req, res) => {
  let store = await Store.findOne({storeId: req.params.id});
  if(!store) return res.status(404).send('There is no store with such id');
  return res.send(cleanResponse(store));
});

router.post('/', auth, async (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { return res.status(400).send(validation.error); }

  let store = new Store({...req.body});

  try {
    //let result = await store.save();
    return res.send(cleanResponse(store));
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
    //let store = await Store.findOneAndUpdate({ "storeId": req.params.id }, { ...req.body });
    let store = await Store.findOne({ "storeId": req.params.id });
    if(!store) {
      return res.status(400).send('There is no store with a chosen id');
    }
    return res.send(req.body);
  }
  catch(e) {
    return res.status(400).send(e.message);
  }
});

router.delete('/:id', auth, validateId, async (req, res) => {
  //let store = await Store.deleteOne({"storeId": req.params.id});
  let store = await Store.findOne({ "storeId": req.params.id });
  if(!store) {
    return res.status(400).send('There is no store with a chosen id');
  }
  return res.send(store);
});

module.exports = router;
