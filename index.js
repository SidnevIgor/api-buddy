const express = require('express');
const app = express();

const courses = require('./courses/courses');

app.use(express.json()); //enabling JSON parsing
app.use('/api/courses', courses);

const port = process.env.PORT || 3000; //getting local variables
app.listen(port);
console.log(`Listening on port ${port}`);
