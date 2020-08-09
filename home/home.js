const express = require('express');
const router = express.Router();
const message = 'Welcome to the Homepage. Please specify your url';

router.get('/', (req,res,next) => {
  let error = new Error(message);
  error.status = 404;
  next(error);
});
router.put('/', (req,res,next) => {
  let error = new Error(message);
  error.status = 404;
  next(error);
});
router.post('/', (req,res,next) => {
  let error = new Error(message);
  error.status = 404;
  next(error);
});
router.delete('/', (req,res,next) => {
  let error = new Error(message);
  error.status = 404;
  next(error);
});

module.exports = router;
