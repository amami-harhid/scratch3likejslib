const Canvas = require('./canvas');
const Loop = require('./controls').Loop
const EntityProxyExt = require('./util/entityProxyExt')
const Env = require('./env');
const EventEmitter = require('events').EventEmitter;
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const Process = require('./process');
//const Rewrite = require('./rewrite');
const Sounds = require('./sounds');

const Speech = require('./speech/text2Speech');
const threads = require('./threads');
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
        this.sounds = null;
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
        Entity.broadcastReceivedFuncArr = Entity.broadcastReceivedFuncArr || [];
        this._isAlive = true;
    }
    isAlive(){
        // スプライトの場合はオーバーライドしている
        return true;
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
        if ( this.sounds == null ) this.sounds = new Sounds();
        const soundData = await this.sounds.importSound( sound );
        return soundData;
    }
    async _addSound(name, soundData, options={}) {
        if ( this.sounds == null ) this.sounds = new Sounds();
        await this.sounds.setSound(name, soundData, options);
    }
    async _loadSound(name, soundUrl, options={}) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        if ( this.sounds == null ) this.sounds = new Sounds();
        await this.sounds.loadSound(name,soundUrl, options);
        this.importAllDone[_importIdx] = true;
    }
    soundSwitch(sound){
        const name = sound.name;
        if ( this.sounds == null ) return;
        this.sounds.switch(name);
    }
    nextSound() {
        if ( this.sounds == null ) return;
        this.soundStop();    
        this.sounds.nextSound();
    }
    soundPlay(sound) {
        if ( this.sounds == null ) return;
        if( sound ) {
            this.soundSwitch(sound);
        }
        this.sounds.play();
    }
    setSoundVolume(volume) {
        if ( this.sounds == null ) return;
        this.sounds.volume = volume;
    }
    setSoundVolumeByName(name, volume) {
        if ( this.sounds == null ) return;
        this.sounds.volume = volume;
    }
    setSoundPitch(pitch) {
        if ( this.sounds == null ) return;
        this.sounds.pitch = pitch;
    }
    soundStop() {
        if ( this.sounds == null ) return;
        this.sounds.stop();
    }
    soundStopImmediately() {
        if ( this.sounds == null ) return;
        this.sounds.stopImmediately();
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

//    _exec ( f, ...args ) {
//        const _rewriter = Rewrite.default;
//        _rewriter.exec( f, this, ...args );
//    }

//    _execWithEmit ( f, emitterEventId, ...args ){
//        const _rewriter = Rewrite.default;
//        _rewriter.execWithEmitter( f, this, emitterEventId, ...args );
//
//    }
//    _execThread ( f, ...args ) {
//        const _rewriter = Rewrite.default;
//        let t = _rewriter.execThread( f, this, ...args );
//        return t;
//    }

    async wait (seconds) {
        await Utils.wait(seconds*1000); // to milliseconds
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

    /**
     * messageId を使い EventEmitter.on を宣言する
     * （他方からemitされたとき受け付け func を実行するため）
     * なお、本メソッドが呼び出される都度、funcを配列に蓄積し、
     * emitされたときは 蓄積したfuncをPromiseとして実行する。
     * @param {*} messageId 
     * @param {*} func 
     */
    whenBroadcastReceived(messageId, func){

        //console.log("whenBroadcastReceived~"+messageId);
        const me = this;
        const threadId = me._generateUUID();
        const runtime = Process.default.runtime;
        const eventId = `message_${messageId}`;
        // func をためる。
        const funcArr = Entity.broadcastReceivedFuncArr;
        let _foundElement = null;
        for(const elem of funcArr){
            if(elem.eventId == eventId){
                _foundElement = elem;
                break;
            }
        }
        if(_foundElement){
            _foundElement.funcArr.push( {"func":func, "threadId":threadId, "target":me} );
        }else{
            // 見つからなかったとき
            _foundElement = {"eventId":eventId, "funcArr":[{"func":func, "threadId":threadId, "target":me}]};
            funcArr.push(_foundElement);
            /**
             * 最初に受け付けたときの on 定義
             * modules: 実行した処理のpromiseを入れる
             * toTarget: ここに指定していない先は無視する
             */
            runtime.on(eventId, function( modules, toTarget, ...args){
                //console.log(`recieved ==== ${eventId}`)
                const funcArr = _foundElement.funcArr;
                //console.log(funcArr);
                for( const funcElement of funcArr){
                    const _me = funcElement.target;
                    let targetOn = false;
                    if(toTarget.length == 0){
                        targetOn = true;
                    }else{
                        const targetIdArr = [];
                        for(const t of toTarget){
                            targetIdArr.push(t.id);
                        }                    
                        if(targetIdArr.includes(_me.id)){
                            targetOn = true;
                        }
                    }
                    if(targetOn){
                        _me._whenBroadcastReceivedStartThread(
                            eventId, 
                            modules,
                            funcElement,
                            ...args
                        );
                    }
                }
            });
        }
    };
    _whenBroadcastReceivedStartThread(eventId, modules, funcElement,...args){
        const arr = modules.get(eventId);
        const func = funcElement.func;
        const threadId = funcElement.threadId;
        const me = funcElement.target;
        const proxy = me.getProxyForHat();
        //console.log('threadId'+threadId);
        proxy.threadId = threadId;
        const obj = me.startThreadMessageRecieved(func, proxy, false, ...args);                    
        //console.log(obj);
        //console.log(proxy)
        const promise = new Promise(async resolve=>{
            for(;;){
                if(obj.done){
                     resolve();
                     break;
                }
                await Utils.wait(0.1);
            }
        });
        arr.push(promise);
    }
    // すぐに実行する
    whenRightNow(func) {
        const me = this;
        const threadId = this._generateUUID();
        const proxy = this.getProxyForHat();
        proxy.threadId = threadId;
        setTimeout(_=>{
            me.startThread(func, proxy);
        },0);
    }
    getProxyForHat(){
        const proxy = EntityProxyExt.getProxy(this, _=>{
            throw 'NOT FOUND PROPERTY in TARGET';
        });
        return proxy;
    }
    async whenFlag (func) {
        const process = Process.default;
        const me = this;
        process.flag.addEventListener('click', async (e)=>{
            me.hatProc(func);
//            const threadId = me._generateUUID();
//            const proxy = me.getProxyForHat();
//            proxy.threadId = threadId;
//            me.startThread(func, proxy);
            e.stopPropagation();
        });
    }
    hatProc(func){
        const me = this;
        const threadId = me._generateUUID();
        const proxy = me.getProxyForHat();
        proxy.threadId = threadId;
        me.startThread(func, proxy);
        return proxy;

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
    // Clone 独立性はどうなるかの考察必要！
    whenCloned(func) {
        const runtime = Process.default.runtime;
        const eventId = `whenClone_${this.name}`;

        runtime.on(eventId, function(clone){
            const threadId = clone._generateUUID();
            const proxy = clone.getProxyForHat();
            proxy.threadId = threadId;
            clone.startThread(func, proxy);
        });
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
        // 同じオブジェクトで前回クリックされているとき
        // 前回のクリックで起動したものを止める。
        const process = Process.default;
        const entityId = this.id;
        const me = this;
        Canvas.canvas.addEventListener('click', async (e)=>{
            threads.removeObjById(entityId); // 前回のクリック分を止める。
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            // クリックしたポイントにあるDrawableのうち一番前面にあるものを返す。
            // そのポイントにDrawableがないときは Falseが返る。
            // 第三引数を省略することで全ての表示中のDrawableから探す。
            const _touchDrawableId = me.render.renderer.pick(mouseX,mouseY, 3, 3);
            if(me.drawableID == _touchDrawableId){
                const threadId = me._generateUUID();
                const proxy = me.getProxyForHat();
                proxy.threadId = threadId;
                if( process.preloadDone === true ) {
                    me.startThread(func, proxy, false); //二重起動禁止
                }
            }
            e.stopPropagation();
        });
    }
    whenTouchingTarget(targets, func) {
        const me = this;
        if( process.preloadDone === true ) {
            //const _func = func.bind(this);
            setInterval(async function(){
                const touching = me.isTouchingTarget(me, targets);
                if(touching === true){
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
    * @param {function} func - requested function.
    */
    whenEvent( eventStr, func ) {
        const threadId = this._generateUUID();
        const proxy = this.getProxyForHat();
        proxy.threadId = threadId;

        const me = this;
        let attachTo = Canvas.canvas;
        let options = {};
        'keydown|keyup|keypress'.indexOf(eventStr) !== -1 ? attachTo = document : null;
        'touchstart|touchmove'.indexOf(eventStr) !== -1 ? options = { passive: true } : null;
        attachTo.addEventListener(eventStr, (e) => {
            e.stopPropagation();
            me.startThread(func, proxy);
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
    startThread( func, entity , doubleRunable=true) {
        // async function*() を直接書くとWebPackでエラーが起こる。
        // しょうがないので テキストから生成する。
        const _entity = entity;
        const threadId = _entity.threadId;
        const obj = threads.createObj();
        obj.entityId = _entity.id;
        obj.threadId = threadId; //this.id;
        obj.entity = _entity;
        obj.doubleRunable = doubleRunable;
        // func がアロー式である場合、
        // (1) funcの中の『this』は funcを定義した場所の上位階層のthisである。
        // (2) funcの中の『this』を変更することはできないことに留意してほしい。
        // (3) funcの引数として entityを渡すようにして アロー式 entity=>{ } の形にはできる
        const src = 'return async function*(){await func(entity);}';
        const f = new Function(['func', 'entity'], src);
        const gen = f( func.bind(_entity),  _entity );
        obj.f = gen();
        threads.registThread( obj );
        return obj;
    }
    startThreadMessageRecieved( func, entity , doubleRunable=true, ...args) {
        // async function*() を直接書くとWebPackでエラーが起こる。
        // しょうがないので テキストから生成する。
        const _entity = entity;
        const threadId = _entity.threadId;
        const obj = threads.createObj();
        obj.entityId = _entity.id;
        obj.threadId = threadId; //this.id;
        obj.entity = _entity;
        obj.doubleRunable = doubleRunable;
        // func がアロー式である場合、
        // (1) funcの中の『this』は funcを定義した場所の上位階層のthisである。
        // (2) funcの中の『this』を変更することはできないことに留意してほしい。
        // (3) funcの引数として entityを渡すようにして アロー式 entity=>{ } の形にはできる
        const src = 'return async function*(){await func(...args);}';
        const f = new Function(['func', 'args'], src);
        const gen = f( func.bind(_entity),  args );
        obj.f = gen();
        threads.registThread( obj );
        return obj;
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

    async while(condition, func) {
        await Loop.while(condition, func, this);
    }
    async repeat(count, func) {
        await Loop.repeat(count, func, this);
    }
}

module.exports = Entity;
