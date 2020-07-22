const express = require('express');
const app = express();
app.use(express.json()); //enabling JSON parsing

const Joi = require('joi'); //validation package

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

const schema = Joi.object({
  name: Joi.string().required()
}); //here we describe the schema of Joi

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/api/courses', (req, res) => {
  res.send(courses);
});
app.get('/api/courses/:id', (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if(!course) res.status(404).send('There is no course with such id');
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const validation = schema.validate(req.body); //here we validate the schema and req.body
  if(validation.error) { res.status(400).send(validation.error); return; }

  let course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
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

app.delete('/api/courses/:id', (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if(!course) {
    res.status(400).send('There is no course with a chosen id');
    return;
  }

  let index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

module.exports = app;
