const Backdrops = require("./backdrops");
const Cast = require("./util/cast");
const Controls = require("./controls");
const Costumes = require("./costumes");
const Entity = require("./entity");
const Env = require("./env");
const EventEmitter = require('events');
const FunctionChecker = require("./util/functionChecker");
const Keyboard = require("./io/keyboard");
const {ImageEffective, SoundOption, RotationStyle} = require('./entityConstant');
const Loop = require("./controls");
const MathUtils = require("./math-utils");
const Monitors = require("./monitor/monitors");
const playGround = require("./playGround");
const Render = require("./render");
const Sounds = require("./sounds");
const Sprite = require("./sprite");
const Stage = require("./stage");
const StageLayering = require("./stageLayering");
const Utils = require("./utils");
class Libs {

    get Backdrops () {
        return Backdrops;
    }
    get Cast () {
        return Cast;
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
    get FunctionChecker () {
        return FunctionChecker;
    }
    get Keyboard () {
        return Keyboard;
    }
    get ImageEffective () {
        return ImageEffective;
    }
    get SoundOption () {
        return SoundOption;
    }
    get RotationStyle () {
        return RotationStyle;
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
     * 指定したkeyが押されているとき TRUE
     * key 省略時は 何かのキーが押されているとき TRUE
     * @param {*} key 
     * @returns {boolean} TRUE/FALSE
     */
    keyIsDown(key) {
        const _p =  playGround.default;
        const _r = _p.runtime;
        if(_r){
            return _r.keyIsDown(key);
        }
        return false;
    }
    /**
     * 指定したkeyが押されていないとき TRUE
     * key 省略時は 何かのキーが押されていないとき TRUE
     * 
     * @param {*} key 
     * @returns TRUE/FALSE
     */
    keyIsNotDown(key) {
        return !(this.keyIsDown(key));        
    }

    /**
     * 何かのキーが押されているとき TRUE
     * @returns TRUE/FALSE
     */
    anyKeyIsDown() {
        return this.keyIsDown();
    }
    /**
     * マウスが押されているとき TRUE
     * @returns 
     */
    mouseIsPressed() {
        const mouse = playGround.default.stage.mouse;       
        return mouse.down;
    }

    get stageWidth () {
        const _p =  playGround.default;
        return  _p.$stageWidth;
    }

    get stageHeight () {
        const _p =  playGround.default;
        return _p.$stageHeight;
    }
    /**
     * get rendering rate object
     */
    get renderRate() {
        const _p = playGround.default;
        if(_p.render != null && _p.canvas){
            const _rateX = _p.render.stageWidth / _p.canvas.width;
            const _rateY = _p.render.stageHeight / _p.canvas.height;
            return {x: _rateX, y:_rateY};    
        }
        throw `unable calculate renderRate`;
    }
    /**
     * mousePosition ( on canvas )
     */
    get mousePosition () {
        const _p = playGround.default;
        const rate = this.renderRate;
        if(_p.canvas){
            const _mouseX = (_p.stage.mouse.x - _p.canvas.width/2 ) * rate.x;
            const _mouseY = (_p.canvas.height/2 - _p.stage.mouse.y) * rate.y;
            return {x: _mouseX, y: _mouseY};    
        }
        throw `unable calculate mouse position`;
    }
    get randomPoint () {
        const _p = playGround.default;
        const randomPointX = (Math.random()-0.5)*_p.$stageWidth;
        const randomPointY = (Math.random()-0.5)*_p.$stageHeight;
        return { x: randomPointX, y: randomPointY };
    }
    get randomDirection ()  {
        const direction = (Math.random()-0.5)* 2 * 360;
        if( direction > 180 ){
            return direction - 180;
        }
        return direction;
    }

    getRandomValueInRange( from , to, forceAsDecimal=false ){
        return Utils.randomizeInRange( from , to, forceAsDecimal);
    }

    get Render () {
        return Render;
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
    // get TextDraw () {
    //     return TextDraw;
    // }
    // get TextOption () {
    //     return TextOption;
    // }
    get Utils () {
        return Utils;
    }

    async wait ( t ) {
        await Utils.wait( t );
    }
    async waitWhile( condition, entity) {
        const _condition = (entity)?condition.bind(entity):condition;
        while(_condition()){
            await Utils.wait(Env.pace);
        }
    }
    async waitUntil( condition , entity) {
        const _condition = (entity)?condition.bind(entity):condition;
        for(;;) {
            if( _condition() ) {
                break;
            }
            await Utils.wait(Env.pace);
        }
    }

    toScratchPosition(x, y) {
        // Base position -> canvas 
        const rate = this.renderRate;
        const _x = x * rate.x;
        const _y = y * rate.y;
        return {x: _x, y: _y};
    }

    toActualPosition( x, y ) {

        const rate = this.renderRate;
        const _x = x / rate.x;
        const _y = y / rate.y;
        return {x: _x, y: _y};

    }
    /**
     * change scratch position to local position
     * @param {number} x  scratch x position
     * @param {number} y  scratch y position
     * @returns local position
     */
    scratchToLocalPos( x, y ) {
        const p = playGround.default;
        if(p.render){
            const w = p.render.stageWidth;
            const h = p.render.stageHeight;
    
            let localPosX = x + w / 2;
            let localPosY = h / 2 - y;
            return {x: localPosX, y: localPosY};    
        }
        throw `unable calculate scratchToLocalPos`;
    }

    /**
     * change local position to scratch position
     * @param {number} x  local x position
     * @param {number} y  local y position
     * @returns {x:number, y:number} scratch position
     */
    localToScratchPos( x, y ) {
        const p = playGround.default;
        if(p.render){
            const w = p.render.stageWidth;
            const h = p.render.stageHeight;
            let scratchPosX = x - w / 2;
            let scratchPosY = h / 2 - y;    
            return {x: scratchPosX, y: scratchPosY};
        }
        throw 'unable calculate localToScratchPos';
    }

    *Iterator(n) {
        for(let i=0; i<n; i++){
            yield(i);
        }
    }
    static _instance;
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