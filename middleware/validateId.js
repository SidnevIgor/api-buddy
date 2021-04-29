const mongoose = require('mongoose');

module.exports = function(req, res, next) {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send('The id has has to be of type Mongo ObjectId');
  }
  else {
    next();
  }
}
