const EventEmitter = require('events').EventEmitter;
const StageLayering = require('../stageLayering');
// Virtual I/O devices.
const Clock = require('../io/clock');
const Keyboard = require('../io/keyboard');
const Mouse = require('../io/mouse');
const MouseWheel = require('../io/mouseWheel');
/**
 * Manages targets, scripts, and the sequencer.
 * @constructor
 */
const Runtime = class extends EventEmitter {
    constructor() {
        super();
        this._target = [];
        this.renderer = null;

        this.ioDevices = {
            clock: new Clock(this),
            //cloud: new Cloud(this),
            keyboard: new Keyboard(this),
            mouse: new Mouse(this),
            mouseWheel: new MouseWheel(this),
            //userData: new UserData(),
            //video: new Video(this)
        };
    }

    attachRenderer ( renderer ) {
        this.renderer = renderer;
        //this.renderer.setLayerGroupOrdering(StageLayering.LAYER_GROUPS);
    }

    getKeyIsDown(key) {
        return this.ioDevices.keyboard.getKeyIsDown(key);
    }
}

module.exports = Runtime;