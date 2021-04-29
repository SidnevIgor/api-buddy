const mongoose = require('mongoose');

module.exports = function(req, res, next) {
  if(isNaN(req.params.id)) {
    return res.status(404).send('The id has to be an integer');
  }
  else{
    next();
  }
}
