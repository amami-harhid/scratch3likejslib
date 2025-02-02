const Canvas = require('./canvas');
const Env = require('./env');
const EventEmitter = require('events').EventEmitter;
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const Process = require('./process');
const Sounds = require('./sounds');
const Speech = require('./speech/text2Speech');
const Rewrite = require('./rewrite');
const Utils = require('./utils');
const Entity = class extends EventEmitter{
    static get EmitIdMovePromise () {
        return '_MovePromise_';
    } 
    constructor (name, layer, options = {} ){
        super();
        this.pace = Env.pace;
        const _process = Process.default;
        this.render = _process.render;
        this.name = name;
        this.layer = layer;
        this.drawableID = this.render.createDrawable(this.layer);
        Entity.messageListeners = [];
        this.id = this._generateUUID();
        this.evented = [
            'whenFlag',
            'whenLoaded',
            'whenClicked',
            'whenKeyPressed',
            'whenEvent',
            'whenReceiveMessage',
            'whenCloned'
          ];
        this.canvas = Canvas.canvas;
        this.flag = _process.flag;
        this.position = {x:0, y:0}; // 意味なし
        this.scale = {x:100,y:100}; // 意味なし
        this.direction = 90; // 意味なし
        this._visible = true;
        this.sound = null;
        this.importAllDone = [];
        this.importIdx = -1;

        const _effect = ('effect' in options )? options.effect: {};
        this._effect = {};
        this.setEffectsEachProperties(_effect);
        this.position =  ('position' in options)? {x: options.position.x, y: options.position.y} : {x:0, y:0};
        this.direction = ('direction' in options)? options.direction : 90;
        this.scale = ('scale' in options)? {x: options.scale.x, y: options.scale.y} : {x:100, y:100};
        this.life = Infinity;
        //console.log(Rewrite.default);
        this.modules = new Map();
    }
    delete () {
        this.modules = null;
        delete this.modules;
    }
    get effect() {
        return this._effect;
    }
    set effect(_effect) {
        this.setEffectsEachProperties(_effect);
    }
    setEffectsEachProperties(_effect) {
        if(Looks.COLOR in _effect ){
            this._effect.color = _effect.color;
        }
        if(Looks.FISHEYE in _effect ){
            this._effect.fisheye = _effect.fisheye;
        }
        if(Looks.WHIRL in _effect ){
            this._effect.whirl = _effect.whirl;
        }
        if(Looks.PIXELATE in _effect ){
            this._effect.pixelate = _effect.pixelate;
        }
        if(Looks.PIXELATE in _effect ){
            this._effect.pixelate = _effect.pixelate;
        }
        if(Looks.MOSAIC in _effect ){
            this._effect.mosaic = _effect.mosaic;
        }
        if(Looks.BRIGHTNESS in _effect ){
            this._effect.brightness = _effect.brightness;
        }
        if(Looks.GHOST in _effect ){
            this._effect.ghost = _effect.ghost;
        }
    }
    clearEffect() {
        this._effect.color = 0;
        this._effect.fisheye = 0;
        this._effect.mosaic = 0;
        this._effect.brightness = 0;
        this._effect.brightness = 0;
        this._effect.ghost = 0;
    }


    _isImportAllDone() {
        let _allDone = true;
        this.importAllDone.map(v => {
            if( v === false ) {
                _allDone = false;
            }
        })
        return _allDone;
    }
    async _addImage(name ,image, costume) {
        await costume.addImage(name, image);
    }

    async _loadImage(name, imageUrl, costume) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        await costume.loadImage(name, imageUrl);
        this.importAllDone[_importIdx] = true;
    }
    async importSound( sound ) {
        if ( this.sounds == undefined ) this.sounds = new Sounds();
        const soundData = await this.sounds.importSound( sound );
        return soundData;
    }
    async _addSound(name, soundData, options={}) {
        if ( this.sounds == undefined ) this.sounds = new Sounds();
        await this.sounds.setSound(name, soundData, options);
    }
    async _loadSound(name, soundUrl, options={}) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        if ( this.sounds == undefined ) this.sounds = new Sounds();
        await this.sounds.loadSound(name,soundUrl, options);
        this.importAllDone[_importIdx] = true;
    }
    soundSwitch(sound){
        const name = sound.name;
        if ( this.sounds == undefined ) return;
        this.sounds.switch(name);
    }
    nextSound() {
        if ( this.sounds == undefined ) return;
        this.soundStop();    
        this.sounds.nextSound();
    }
     soundPlay(sound) {
        if ( this.sounds == undefined ) return;
        if( sound ) {
            this.soundSwitch(sound);
        }
        this.sounds.play();
    }
    setSoundVolume(volume) {
        if ( this.sounds == undefined ) return;
        this.sounds.volume = volume;
    }
    setSoundVolumeByName(name, volume) {
        if ( this.sounds == undefined ) return;
        this.sounds.volume = volume;
    }
    setSoundPitch(pitch) {
        if ( this.sounds == undefined ) return;
        this.sounds.pitch = pitch;
    }
    soundStop() {
        if ( this.sounds == undefined ) return;
        this.sounds.stop();
    }
    soundStopImmediately() {
        if ( this.sounds == undefined ) return;
        this.sounds.soundStopImmediately();
    }
    async startSoundUntilDone() {
        if ( this.sounds ) await this.sounds.startSoundUntilDone();
        return;
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    setScale(x, y) {
        this.scale.x = x;
        if( y == undefined) {
            this.scale.y = x;

        }else{
            this.scale.y = y;
        }
    }
    _directionChange( direction ) {
        if( direction > 180 ) {
            return direction - 360;
        }
        return direction;    
    }
    setDirection(direction) {
        const _direction = this._directionChange(direction);
        this.direction = _direction;
    }

    turnRight( value ) {
        const _direction = this.direction + value;
        this.setDirection( _direction )
    }

    turnLeft( value ) {
        const _direction = this.direction - value;
        this.setDirection( _direction )
    }

    _generateUUID () {
        return Utils.generateUUID();
    }
/* 
    _releaseWaited (triggeringId) {
        const event = new window.CustomEvent(`blockLike.waited.${triggeringId}`, { detail: { value: 0 } })
        document.dispatchEvent(event)
    }
    _setToVar (varString, value) {
        try {
            eval(`${varString} = '${value}'`) // eslint-disable-line no-eval
        } catch (error) {
            throw ('BlockLike.js Error: Variables accepting a value must be declared in the global scope.') // eslint-disable-line no-throw-literal
        }
    }
*/

    _exec ( f, ...args ) {
        const _rewriter = Rewrite.default;
        _rewriter.exec( f, this, ...args );
    }
    _execWithEmit ( f, emitterEventId, ...args ){
        const _rewriter = Rewrite.default;
        _rewriter.execWithEmitter( f, this, emitterEventId, ...args );

    }
    _execThread ( f, ...args ) {
        const _rewriter = Rewrite.default;
        let t = _rewriter.execThread( f, this, ...args );
        return t;
    }
/*
    invoke (func, argsArr, theVar = null, triggeringId = null) {
        // theVar and triggeringId are not user supplied, they are inserted by rewriter.
        let args = argsArr;
        !(argsArr instanceof Array) ? args = [argsArr] : null;
    
        this._exec(func, args).then((result) => {
            // this is the waited method listener. release it.
            this._releaseWaited(triggeringId)
            // set the user defined variable to the captured value.
            theVar ? this._setToVar(theVar, result) : null
        })
    }
 */
    wait (sec, triggeringId = null) {
        // triggeringId is not user supplied, it is inserted by rewriter.
        setTimeout(() => {
            this._releaseWaited(triggeringId)
        }, sec * 1000)
    }

    // preloadが終わったときに呼ぶことにしようかな？
    async whenLoaded (func) {
        await func();
/*
        setTimeout(() => {
            this._exec(func, [])
        }, 0)
*/
    }
    broadcast(messageId, ...args ) {
        const runtime = Process.default.runtime;
        const eventId = `message_${messageId}`;
        this.modules.set(eventId, []);
        const sendTargets = [];
        runtime.emit(eventId, this.modules, sendTargets, ...args);
    }
    async broadcastAndWait(messageId, ...args ){
        const wait = Process.default.Utils.wait;
        const runtime = Process.default.runtime;
        const eventId = `message_${messageId}`;
        this.modules.set(eventId, []);
        const sendTarges = [];
        runtime.emit(eventId, this.modules, sendTarges, ...args);
        await wait(10);
        const promises = this.modules.get(eventId);
        if(promises.length > 0) {
            await Promise.all(promises);
            return;
        }
    }
    broadcastToTargets(messageId, target, ...args) {
        const runtime = Process.default.runtime;
        const eventId = `message_${messageId}`;
        this.modules.set(eventId, []);
        const _targets = [];
        if( Array.isArray(target) ) {
            target.map(v=>{
                if( v instanceof Entity) {
                    _targets.push(v);
                }
            })
        }else{
            const _target = target;
            if( _target instanceof Entity) {
                _targets.push(_target);
            }
        }
        if(sendTargets.length > 0) {
            runtime.emit(eventId, this.modules, _targets, ...args);
        } 
    }
    async broadcastAndWaitToTargets(messageId, target, ...args) {
        const runtime = Process.default.runtime;
        const wait = Process.default.Utils.wait;
        const eventId = `message_${messageId}`;
        this.modules.set(eventId, []);
        const _targets = [];
        if( Array.isArray(target) ) {
            target.map(v=>{
                if( v instanceof Entity) {
                    _targets.push(v);
                }
            })
        }else{
            const _target = target;
            if( _target instanceof Entity) {
                _targets.push(_target);
            }
        }
        if(sendTargets.length > 0) {
            runtime.emit(eventId, this.modules, _targets, ...args);
            await wait(10);
            const promises = this.modules.get(eventId);
            if(promises.length > 0) {
                await Promise.all(promises);
                return;
            }
        }
    }
/*  
    // recieveMessage :  runtime で受信したいので 構造作り変えをしてから実装する
    recieveMessage( messageId, func) {
        // func を rewriteしてから使う
        // this.runtime.on( id, func );
        const _rewriter = Rewrite.default;
        const _func = _rewriter._rewrite(func); // <---- _rewrite とは別を用意したい。
        const _funcBinded = _func.bind(this);
        const runtime = Process.default.runtime;
        const eventId = `message_${messageId}`;
        runtime.on(eventId, function(modules, toTarget, ...args){
            let isTarget = false;
            if(toTarget.length == 0){
                // 全てで受信
                isTarget = true;
            }else{
                for(let i=0; i<toTarget.length;i++){
                    const t = toTarget[i];
                    if(this.id == t.id ) {
                        isTarget = true;
                        break;
                    }
                }
            }
            if(isTarget === true) {
                _funcBinded( ...args ).catch(e=>{console.error('script=', func.toString()); throw new Error(e)});
            }
        })
    }
*/

    whenBroadcastReceived(messageId, func){
        const _rewriter = Rewrite.default;
        const _func = _rewriter._rewrite(func); 
        // ↑ _rewrite とは別を用意したい。
        const _funcBinded = _func.bind(this);

        const runtime = Process.default.runtime;
        const eventId = `message_${messageId}`;
        const me = this;
        runtime.on(eventId, function( modules, toTarget, ...args){
            let isTarget = false;
            if(toTarget.length == 0){
                // 全てで受信
                isTarget = true;
            }else{
                for(let i=0; i<toTarget.length;i++){
                    const t = toTarget[i];
                    if(this.id == t.id ) {
                        isTarget = true;
                        break;
                    }
                }
            }
            if(isTarget === true) {
                const promise = _funcBinded( ...args );
                const arr = modules.get(eventId);
                arr.push(promise);
                promise.catch(e=>{console.error('script=', func.toString()); throw new Error(e)});
            }
        })
    };

    // すぐに実行する
    whenRightNow(func) {

        this._exec( func );

    }

    // async としないほうがよいかも。
    async whenFlag (func) {
        const process = Process.default;
        const me = this;
        const _func = func.bind(this);
        if (process.flag) {
            // フラグエレメントへのイベント登録とするべき。
            process.flag.addEventListener('click', async (e) => {
                //me.flag.remove; // <--- フラグ要素があれば消すとしたい。
                if( process.preloadDone === true ) {
//                    const _func = me.modules.get('func')
                    //(func.bind(this))();
//                    me._exec( _func );
                    me._exec( func );
                }
                //me._exec(func, [e])
                e.stopPropagation();  // イベント伝播を停止
            })
        }
    }
    whenMouseTouched (func) {
        const process = Process.default;
        const me = this;
        Canvas.canvas.addEventListener('mousemove', async(e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            const p = Process.default;
//            console.log(`event   mouseX=${mouseX}, mouseY=${mouseY}`);
//            console.log(`sensing mouseX=${p.mouseX}, mouseY=${p.mouseY}`);
            const _touchDrawableId = me.render.renderer.pick(mouseX,mouseY, 3, 3, [me.drawableID]);
            if(me.drawableID == _touchDrawableId){
                if( process.preloadDone === true ) {
                    //_func();
                    const EmitId = 'WhenMouseTouchedStopper';
                    this.emit( EmitId );
                    this._execWithEmit( func, EmitId );
                }
            }
            e.stopPropagation()
        }, {});

    }
    whenCloned(func) {

        // func を rewriteすること！
        const runtime = Process.default.runtime;
        const eventId = `whenClone_${this.name}`;
        runtime.on(eventId, function(clone){
            clone._exec( func );

        })
    }
    isNotMouseTouching() {
        return !(this.isMouseTouching());
    }
    isMouseTouching() {
        const p = Process.default;
        const mouseX = p.stage.mouse.x +1; // +1 は暫定、理由不明
        const mouseY = p.stage.mouse.y +1;
        const _touchDrawableId = p.render.renderer.pick(mouseX,mouseY, 2, 2, [this.drawableID]); 
        if(this.drawableID == _touchDrawableId){
            return true;
        }
        return false;

    }
    /**
     * whenClickedが二重に呼ばれたときは
     * 前回動作しているスレッドを停止させる。
     * @param {function} func 
     */
    whenClicked (func) {
        const process = Process.default;
        const runtime = process.runtime;
        const me = this;
        //const _func = func.bind(this);
        Canvas.canvas.addEventListener('click', async(e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            const _touchDrawableId = me.render.renderer.pick(mouseX,mouseY, 3, 3, [me.drawableID]);
            if(me.drawableID == _touchDrawableId){
                if( process.preloadDone === true ) {
                    //_func();
//                    this._exec( func );
                    const EmitId = 'WhenClickedStopper';
                    this.emit( EmitId );
                    runtime.emit( Entity.EmitIdMovePromise );
                    this._execWithEmit( func, EmitId );
                }
            }
            e.stopPropagation()
        }, {});
    }
    whenTouchingTarget(targets, func) {
        const me = this;
        if( process.preloadDone === true ) {
            //const _func = func.bind(this);
            setInterval(async function(){
                const touching = me.isTouchingTarget(me, targets);
                if(touching === true){
//                    func();
//                    this._exec( func );
                    const EmitId = 'WhenToucheingTargetStopper';
                    this.emit( EmitId );
                    this._execWithEmit( func, EmitId );
                }
            },0);
        }
    }
    isTouchingTargetToTarget(src, targets) {
        const targetIds = [];
        if(Array.isArray(targets)){
            for(const _t of targets) {
                const _drawableId = _t.drawableID;
                targetIds.push(_drawableId);
            }    
        }else{
            const _drawableId = targets.drawableID;
            targetIds.push(_drawableId);
        }
        if( targetIds.length > 0 ) {
            try{
                const touching = src.render.renderer.isTouchingDrawables(src.drawableID, targetIds);
                return touching;    
    
            }catch(e){
            }
        }
        return false;
    }

    getTouchingTarget(targets) {
        const src = this;
        const touchingTragets = []
        if(Array.isArray(targets)){
            for(const t of targets){
                const touching = this.isTouchingTargetToTarget(src,t);
                if( touching === true) {
                    touchingTragets.push(t);
                }
            }
        }else{
            const t = targets
            const touching = this.isTouchingTargetToTarget(src, t);
            if( touching === true) {
                touchingTragets.push(t);
            }
        }

        return touchingTragets;
    }

    isTouchingTarget(targets) {
        const src = this;
        const touching = this.isTouchingTargetToTarget(src,targets);
        return touching;
    }
    /**
    * whenEvent - adds the specified event listener to sprite/stage.
    * When triggered will invoke user supplied function.
    *
    * @example
    * let stage = new LS.Stage();
    * let sprite = new LS.Sprite();
    *
    * sprite.addTo(stage);
    * sprite.whenEvent('mouseover', (e) => {
    *   console.log(e);
    * });
    *
    * @param {string} eventStr - the named event (mosemove etc.).
    * @param {function} func - a function to rewrite and execute.
    */
    whenEvent( eventStr, func ) {
        const me = this;
        let attachTo = Canvas.canvas;
        let options = {};
        'keydown|keyup|keypress'.indexOf(eventStr) !== -1 ? attachTo = document : null;
        'touchstart|touchmove'.indexOf(eventStr) !== -1 ? options = { passive: true } : null;
        attachTo.addEventListener(eventStr, (e) => {
//            func(e);
            this._exec( func, e );
            e.stopPropagation()
        }, options);
    }

    updateVisible( visible ) {
        this._visible = visible;
        this.render.renderer.updateDrawableVisible(this.drawableID, visible);
    }

    set visible( _visible ){
        this.updateVisible(_visible);
    }

    get visible() {
        return this._visible;
    }

    setRotationStyle () {

    }

    startThread( func ) {

        // whenFlag の中から呼び出されると loopProtectionga
        // 二重にかかる

        let t = this._execThread( func );
        return t;
    }
    
    // これは使わない
    stopThread( t ) {
        clearTimeout( t );
    }
    pointTowardsMouseCursolGlobal( ) {
        const process = Process.default;
        const rect = process.canvas.getBoundingClientRect();

        const canvasGlobalCenterX = rect.x + rect.width/2 // - canvasBorderX;
        const canvasGlobalCenterY = rect.y + rect.height/2 // - canvasBorderY;
    
        const pageX = process.stage.mouse.pageX;
        const pageY = process.stage.mouse.pageY;
    
        const _mouseXG = (pageX - canvasGlobalCenterX );
        const _mouseYG = (canvasGlobalCenterY - pageY);
    
        const _rateX = process._render.stageWidth / process.canvas.width;
        const _rateY = process._render.stageHeight / process.canvas.height;
    
        const targetX = (_mouseXG) * _rateX;
        const targetY = (_mouseYG) * _rateY;

        const dx = targetX - this.position.x;
        const dy = targetY - this.position.y;

        let direction = 90 - MathUtils.radToDeg(Math.atan2(dy, dx));
        if(direction > 180) {
            direction -= 360;
        }
        this.direction = direction;
    
    }
    pointTowardsMouseCursol( ) {
        // CANVAS 外に出てら ポインターを向かない。
        const process = Process.default;
        const targetX = process.mousePosition.x;
        const targetY = process.mousePosition.y;
        const dx = targetX - this.position.x;
        const dy = targetY - this.position.y;
        let direction = 90 - MathUtils.radToDeg(Math.atan2(dy, dx));
        if(direction > 180) {
            direction -= 360;
        }
        this.direction = direction;
    }
    setXY(x, y) {
 //       const oldX = this.position.x;
 //       const oldY = this.position.y;
        const _renderer = this.render.renderer;
        const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [x, y]);
        this.position.x = _position[0];
        this.position.y = _position[1];
        _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？

    }
    setXY(x, y) {
 //       const oldX = this.position.x;
 //       const oldY = this.position.y;
        const _renderer = this.render.renderer;
        const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [x, y]);
        this.position.x = _position[0];
        this.position.y = _position[1];
        _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？

    }
    setX(x) {
        const _renderer = this.render.renderer;
        const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [x, this.position.y]);
        this.position.x = _position[0];
        this.position.y = _position[1];
         _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
       
    }
    changeX(x) {
        const _renderer = this.render.renderer;
        let _x = this.position.x + x;
        const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [_x, this.position.y]);
        this.position.x = _position[0];
        this.position.y = _position[1];
         _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
       
    }
    setY(y) {
        const _renderer = this.render.renderer;
        const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [this.position.x, y]);
        this.position.x = _position[0];
        this.position.y = _position[1];
         _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
       
    }
    changeY(y) {
        const _renderer = this.render.renderer;
        let _y = this.position.y + y;
        const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [this.position.x, _y]);
        this.position.x = _position[0];
        this.position.y = _position[1];
         _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
       
    }
    speech(words, properties, gender='male', locale='ja-JP') {
        const _properties = (properties)? properties : {};

        const speech = Speech.getInstance();
        speech.gender = gender;
        speech.locale = locale;
        speech.speech(words, _properties);

    }

    
    async speechAndWait(words, properties, gender='male', locale='ja-JP') {
        const _properties = (properties)? properties : {};

        const speech = Speech.getInstance();
        speech.gender = gender;
        speech.locale = locale;
        await speech.speechAndWait(words, _properties);

    }

    update() {
        if(this.life != Infinity) {
            this.life -= 1 / Process.default.Env.pace * 1000;
            if( this.life < 0 ) {
                this.remove();
            }    
        }
    }
}

module.exports = Entity;
