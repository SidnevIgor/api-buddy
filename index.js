const express = require('express');
const app = express();
const config = require('config'); //allows to use local variables
const helmet = require('helmet'); //protecting routes
const mongoose = require('mongoose');

const home = require('./home/home');
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
app.use('/', home);

const port = process.env.PORT || 3000; //getting local variables
app.listen(port);
console.log(`Listening on port ${port}`);
console.log(`Environment: ${config.get('name')}`);
mongoose.connect('mongodb://localhost/playground').then(() => {
  console.log('Successfully connected to the database');
})
.catch((err) => {
  console.log(`Error happened during the conenction to MongoDB: ${err}`);
})
