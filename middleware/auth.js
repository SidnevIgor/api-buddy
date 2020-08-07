module.exports = function(req,res,next) {
  let token = req.header('x-auth-token');
  if(!token) return res.status(401).send('This route requires authentication');
  else {
    next();
  }
}
