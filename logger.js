const url = 'https://test.io/logger';

function logger(val) {
  console.log(val);
}

module.exports.log = logger;
module.exports.url = url;
