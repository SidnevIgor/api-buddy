const express = require('express');
const app = express();

const helmet = require('helmet');
const books = require('./books/books');
const customers = require('./customers/customers');
const stores = require('./stores/stores');
const orders = require('./orders/orders');
const employees = require('./employees/employees');

app.use(express.json()); //enabling JSON parsing
app.use(helmet());
app.use('/api/books', books);
app.use('/api/customers', customers);
app.use('/api/stores', stores);
app.use('/api/orders', orders);
app.use('/api/employees', employees);

const port = process.env.PORT || 3000; //getting local variables
app.listen(port);
console.log(`Listening on port ${port}`);
