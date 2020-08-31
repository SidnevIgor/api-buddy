module.exports = function(obj) {
  if(Array.isArray(obj)) {
    let arr = [];
    for (let i = 0; i < obj.length; i++) {
      let ob = {...obj[i]._doc};
      delete ob._id;
      delete obj.__v;
      arr.push(ob);
    }
    return arr;
  }
  else {
    console.log('Entered delete condition');
    delete obj[i]._id, obj[i].__v;
    return obj;
  }
}
