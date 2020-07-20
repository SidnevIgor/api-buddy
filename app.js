//let log = require('./logger');
//log('message');


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

//Events handling
const Logger = require('./logger');
const logger = new Logger();

logger.on('messageLogged', function() {
  console.log('Message has been logged!');
});
logger.log('Hello!');

//HTTP Service Native
const http = require('http');
const server = http.createServer((req,res) => {
  if (req.url === '/') {
    res.write('Service envoked!');
    res.end();
  }
});
server.listen(3000);
console.log('Listening on port 3000');
