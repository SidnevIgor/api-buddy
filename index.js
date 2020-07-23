const express = require('express');
const app = express();

const books = require('./books/books');

app.use(express.json()); //enabling JSON parsing
app.use('/api/books', books);

const port = process.env.PORT || 3000; //getting local variables
app.listen(port);
console.log(`Listening on port ${port}`);
