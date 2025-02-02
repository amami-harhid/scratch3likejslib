const Utils = require('./utils');

const Controls = class {

    static async waitSeconds( _seconds  ) {
        await Utils.wait( _seconds * 1000 );
    }

    static async waitUntil( _condition , _pace = 33) {
        for(;;) {
            if(_condition === true) break;
            await Utils.wait(_pace);
        }
    }

};

module.exports = Controls;