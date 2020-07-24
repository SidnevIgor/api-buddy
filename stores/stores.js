const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

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


router.get('/', (req, res) => {
  res.send(stores);
});
router.get('/:id', (req, res) => {
  let store = stores.find((c) => c.id === parseInt(req.params.id));
  if(!store) res.status(404).send('There is no store with such id');
  res.send(store);
});

router.post('/', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let store = {
    id: stores.length + 1,
    city: req.body.city,
    street: req.body.street,
    building: req.body.building,
    postcode: req.body.postcode,
    employees: req.body.employees
  }
  stores.push(store);
  res.send(store);
});

router.put('/:id', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let store = stores.find((c) => c.id === parseInt(req.params.id));
  if(!store) {
    res.status(400).send('There is no store with a chosen id');
    return;
  }

  store.city = req.body.city;
  store.street = req.body.street;
  store.building = req.body.building;
  store.postcode = req.body.postcode;
  store.employees = req.body.employees;
  res.send(store);
});

router.delete('/:id', (req, res) => {
  let store = stores.find((c) => c.id === parseInt(req.params.id));
  if(!store) {
    res.status(400).send('There is no store with a chosen id');
    return;
  }

  let index = stores.indexOf(store);
  stores.splice(index, 1);
  res.send(store);
});

module.exports = router;
