module.exports = function(obj) {
  if(Array.isArray(obj)) {
    let arr = [];
    for (let i = 0; i < obj.length; i++) {
      let ob = {...obj[i]._doc};
      delete ob._id;
      arr.push(ob);
    }
    return arr;
  }
  else {
    let ob = { ...obj };
    delete ob._id;
    return obj;
  }
}
