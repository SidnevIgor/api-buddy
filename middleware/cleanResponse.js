module.exports = async function(req, res, next) {
  if(res.statusCode === 200) {
    console.log('Success!!!');
    console.log(val);
    res.on('finish', () => console.log(res));
  }
  else {
    next();
  }
}
