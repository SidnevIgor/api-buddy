const express = require('express');
const app = express();

const books = require('./books/books');
const customers = require('./customers/customers');

app.use(express.json()); //enabling JSON parsing
app.use('/api/books', books);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000; //getting local variables
app.listen(port);
console.log(`Listening on port ${port}`);
