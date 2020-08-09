const express = require('express');
require('express-async-errors');
const app = express();
const config = require('config'); //allows to use local variables
const helmet = require('helmet'); //protecting routes
const mongoose = require('mongoose'); //this allows to talk with MongoDB
const timeout = require('connect-timeout'); //this allows to stop trying to connect after a certain time

const home = require('./home/home');
const books = require('./books/books');
const customers = require('./customers/customers').router;
const stores = require('./stores/stores');
const orders = require('./orders/orders');
const employees = require('./employees/employees');
const auth = require('./auth/auth');

const error = require('./middleware/error');
if(!config.get('secret')) { //we check if secret var (api-buddy-secret) is set
  console.log('Secret is not defined!!!');
  process.exit(1);
}

app.use(express.json()); //enabling JSON parsing
app.use(timeout('7s'));
app.use(helmet());
app.use('/api/books', books);
app.use('/api/customers', customers);
app.use('/api/stores', stores);
app.use('/api/orders', orders);
app.use('/api/employees', employees);
app.use('/api/auth', auth);
app.use('/', home);
app.use(error);

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
