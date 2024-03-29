const express = require('express');
require('express-async-errors');
require('compression');
const app = express();
const config = require('config'); //allows to use local variables
const helmet = require('helmet'); //protecting routes
const mongoose = require('mongoose'); //this allows to talk with MongoDB
const timeout = require('connect-timeout'); //this allows to stop trying to connect after a certain time
var winston = require('winston');
const cors = require('cors');

const home = require('./home/home');
const books = require('./books/books');
const authBooks = require('./books/auth-books');
const customers = require('./customers/customers').router;
const authCustomers = require('./customers/auth-customers').router;
const stores = require('./stores/stores');
const authStores = require('./stores/auth-stores');
const orders = require('./orders/orders');
const authOrders = require('./orders/auth-orders');
const employees = require('./employees/employees');
const authEmployees = require('./employees/auth-employees');
const auth = require('./auth/auth');
const error = require('./middleware/error');

if(!config.get('secret')) { //we check if secret var (api-buddy-secret) is set
  console.log('Secret is not defined!!!');
  process.exit(1);
}

winston.configure({
    transports: [
      new (winston.transports.File)({ filename: 'errors.log', level: 'error' })
    ]
}); //here we set where the error logs should be saved

process.on('uncaughtException', (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
}); //checking for errors outside of routes (sync erros)

app.use(cors());
app.use(express.json()); //enabling JSON parsing
app.use(timeout('7s')); //we give 7 sec until timeout error
app.use(helmet());

app.use('/api/books', books);
app.use('/api/customers', customers);
app.use('/api/stores', stores);
app.use('/api/orders', orders);
app.use('/api/employees', employees);

app.use('/api/auth/books', authBooks);
app.use('/api/auth/customers', authCustomers);
app.use('/api/auth/employees', authEmployees);
app.use('/api/auth/orders', authOrders);
app.use('/api/auth/stores', authStores);
app.use('/api/auth', auth);

app.use('/', home);
app.use(error);

const port = process.env.PORT || 3000; //getting local variables
const server = app.listen(port);
console.log(`Listening on port ${port}`);
console.log(`Environment: ${config.get('name')}`);

const db = config.get('db');
mongoose.connect(db).then(() => {
  console.log(`Successfully connected to the database - ${db}`);
})
.catch((err) => {
  console.log(`Error happened during the conenction to MongoDB: ${err}`);
});
//this is required for testing only

module.exports = server;
