const Backdrops = require('./backdrops');
const Controls = require('./controls').Controls;
const Costumes = require('./costumes');
const Entity = require('./entity');
const Env = require('./env');
const EventEmitter = require('events').EventEmitter;
const Keyboard = require('./io/keyboard');
const Looks = require('./looks');
const Loop = require('./controls').Loop;
const MathUtils = require('./math-utils');
const process = require('./process');
const Render = require('./render');
const RotationStyle = require('./rotationStyle');
const Sounds = require('./sounds');
const Sprite = require('./sprite');
const Stage = require('./stage');
const StageLayering = require('./stageLayering');
const TextDraw = require('./text/textDraw');
const TextOption = require('./text/textOption');
const Utils = require('./utils');
const Monitors = require('./monitors');
const Libs = class {

    get Backdrops () {
        return Backdrops;
    }
    get Costumes () {
        return Costumes;
    }
    get Controls () {
        return Controls;
    }
    get Entity () {
        return Entity;
    }
    get Env () {
        return Env;
    }
    get EventEmitter () {
        return EventEmitter;
    }
    get keyboard () {
        return Keyboard;
    }
    get Looks () {
        return Looks;
    }
    get Loop () {
        return Loop;
    }
    get Monitors () {
        return Monitors;
    }
    get MathUtils () {
        return MathUtils;
    }
    /**
     * get rendering rate object
     */
    get renderRate() {
        const _p = process.default;
        const _rateX = _p._render.stageWidth / _p.canvas.width;
        const _rateY = _p._render.stageHeight / _p.canvas.height;
        return {x: _rateX, y:_rateY};
    }
    /**
     * mousePosition ( on canvas )
     */
    get mousePosition () {
        const _p = process.default;
        const rate = this.renderRate;
        const _mouseX = (_p.stage.mouse.x - _p.canvas.width/2 ) * rate.x;
        const _mouseY = (_p.canvas.height/2 - _p.stage.mouse.y) * rate.y;
        return {x: _mouseX, y: _mouseY};
    }
    get randomPoint () {
        const _p = process.default;
        const randomPointX = (Math.random()-0.5)*_p.stageWidth;
        const randomPointY = (Math.random()-0.5)*_p.stageHeight;
        return { x: randomPointX, y: randomPointY };
    }
    get randomDirection () {
        const direction = (Math.random()-0.5)* 2 * 360;
        if( direction > 180 ){
            return direction - 180;
        }
        return direction;
    }
    get Render () {
        return Render;
    }
    get RotationStyle () {
        return RotationStyle;
    }
    get Sounds () {
        return Sounds;
    }
    get Stage () {
        return Stage;
    }
    get StageLayering () {
        return StageLayering;
    }
    get Sprite () {
        return Sprite;
    }
    get TextDraw () {
        return TextDraw;
    }
    get TextOption () {
        return TextOption;
    }
    get Utils () {
        return Utils;
    }

    async wait ( t ) {
        await Utils.wait( t );
    }
    async waitUntil( condition , entity) {
        const _condition = condition.bind(entity);
        for(;;) {
            if( _condition() ) {
                break;
            }
            await Utils.wait(Env.pace);
        }
    }

    static getInstance() {
        if( Libs._instance == undefined ) {
            Libs._instance = new Libs();
        }
        return Libs._instance;
    }

    constructor () {
    }
}

export default Libs.getInstance();