const winston = require('winston');

module.exports = function(err, req, res, next) {
  winston.error(err.message, err); //here we add the error message to winston errors log
  res.status(err.status).send(err.message);
}
