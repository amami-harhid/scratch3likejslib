const EventEmitter = require('events');

// Virtual I/O devices.
const Keyboard = require('../io/keyboard');

/**
 * runtime
 */
class Runtime extends EventEmitter{

    /**
     * @constructor
     */
    constructor() {
        super();
        //this._target = [];
        /** @type S3Renderer */
        this.renderer = null;
        const ioDevice = {
            keyboard: new Keyboard(this),
        }
        this.ioDevices = ioDevice;
    }

    get GREEN_BUTTON_ENABLED () {
        return 'GREEN_BUTTON_ENABLED';
    }

    attachRenderer ( renderer ) {
        this.renderer = renderer;
    }

    keyIsDown(key) {
        return this.ioDevices.keyboard.keyIsDown(key);
    }

};
module.exports = Runtime;