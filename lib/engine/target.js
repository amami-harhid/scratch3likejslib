const EventEmitter = require('events').EventEmitter;

const Target = class extends EventEmitter {
    constructor(runtime) {
        super();
        this.runtime = runtime;
    }
}

module.exports = Target;