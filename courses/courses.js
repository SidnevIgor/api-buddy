const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

const schema = Joi.object({
  name: Joi.string().required()
}); //here we describe the schema of Joi


router.get('/', (req, res) => {
  res.send(courses);
});
router.get('/:id', (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if(!course) res.status(404).send('There is no course with such id');
  res.send(course);
});

router.post('/', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
});

router.put('/:id', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if(!course) {
    res.status(400).send('There is no course with a chosen id');
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

router.delete('/:id', (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if(!course) {
    res.status(400).send('There is no course with a chosen id');
    return;
  }

  let index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

module.exports = router;
