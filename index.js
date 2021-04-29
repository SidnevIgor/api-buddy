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
const goals = require('./goals/goals');
const authBooks = require('./goals/auth-goals');
const customers = require('./customers/customers').router;
const authCustomers = require('./customers/auth-customers').router;
const lists = require('./lists/lists');
const authLists = require('./lists/auth-lists');
const auth = require('./auth/auth');
const authGuest = require('./auth/auth-guest');
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

app.use('/api/goals', goals);
app.use('/api/customers', customers);
app.use('/api/lists', lists);

app.use('/api/auth/books', authBooks);
app.use('/api/auth/customers', authCustomers);
app.use('/api/auth/lists', authLists);
app.use('/api/auth-guest', authGuest);
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
