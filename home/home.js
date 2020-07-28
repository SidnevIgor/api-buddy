const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
  res.send('Welcome to the Homepage. Please specify your url');
});
router.put('/', (req,res) => {
  res.send('Welcome to the Homepage. Please specify your url');
});
router.post('/', (req,res) => {
  res.send('Welcome to the Homepage. Please specify your url');
});
router.delete('/', (req,res) => {
  res.send('Welcome to the Homepage. Please specify your url');
});

module.exports = router;
