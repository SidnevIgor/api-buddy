const express = require('express');
const router = express.Router();

const Joi = require('joi'); //validation package

const customers = [
  { id: 1, firstName: 'name1', lastName: 'lname1', email: 'test@gmail.com', tel: '123-456-789' },
  { id: 2, firstName: 'name2', lastName: 'lname2', email: 'test@gmail.com', tel: '123-456-789' },
  { id: 3, firstName: 'name3', lastName: 'lname3', email: 'test@gmail.com', tel: '123-456-789' }
];
