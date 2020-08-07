const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
  let token = req.header('x-auth-token');
  if(!token) return res.status(401).send('This route requires authentication');
  else {
    try {
      let decoded = jwt.verify(token, config.get('secret')); //we try to decode the token using private key
      req.user = decoded; //we store a user ID in req now and can access it leter on
      next();
    }
    catch(ex) {
      res.status(400).send('Invalid token');
    }
  }
}
