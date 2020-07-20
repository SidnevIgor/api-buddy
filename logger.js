const EventEmitter = require('events');

class Logger extends EventEmitter{
  log(message) {
    this.emit('Message emitted: ', message);
  }
}

module.exports = Logger;
