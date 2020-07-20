let log = require('./logger');
log('message');


//Standard Node packages

//Path module
const path = require('path');
const pathObj = path.parse(__filename);
console.log(pathObj);


//OS module
const os = require('os');
const totalMemory = os.totalmem();
const freeMemory = os.freemem();

console.log(`The total memory of this machine is ${totalMemory} and free memory is ${freeMemory}`);

//FileSystem
const fs = require('fs');
fs.readdir('./', (err, files) => {
  if(err) console.log('Error happened');
  else {
     console.log(files);
  }
});
