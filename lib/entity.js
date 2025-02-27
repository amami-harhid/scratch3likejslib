const Canvas = require('./canvas');
const {Loop,Controls} = require('./controls');
const Element = require('./element');
const EntityProxyExt = require('./util/entityProxyExt')
const Env = require('./env');
const EventEmitter = require('events').EventEmitter;
const Libs = require('./libs');
const MathUtils = require('./math-utils');
const PlayGround = require('./playGround');
//const Rewrite = require('./rewrite');
const Sounds = require('./sounds');

const Speech = require('./speech/text2Speech');
const threads = require('./threads');
const {ImageEffective, SoundOption, RotationStyle} = require('./types');
const Utils = require('./utils');
const Entity = class extends EventEmitter{
    static get EmitIdMovePromise () {
        return '_MovePromise_';
    } 
    constructor (name, layer, options = {} ){
        super();
        this.pace = Env.pace;
        const _playground = PlayGround.default;
        this.render = _playground.render;
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
        this.flag = _playground.flag;
        this.$_position = {x:0, y:0}; // 意味なし
        this.$_scale = {x:100,y:100}; // 意味なし
        this.$_direction = 90; // 意味なし
        this._visible = true;
        this.sounds = null;
        this.sound = null;
        this.importAllDone = [];
        this.importIdx = -1;

        const _effect = ('effect' in options )? options.effect: {};
        this._effect = {};
        this.setEffectsEachProperties(_effect);
        this.$_position =  ('position' in options)? {x: options.position.x, y: options.position.y} : {x:0, y:0};
        this.$_prev_position = this.$_position;
        this.$_direction = ('direction' in options)? options.direction : 90;
        this.$_prev_direction = this.$_direction;

        this.$_scale = ('scale' in options)? {x: options.scale.x, y: options.scale.y} : {x:100, y:100};
        this.$_prev_scale = {};
        this.$_prev_scale.x = this.$_scale.x;
        this.$_prev_scale.y = this.$_scale.y;

        this.life = Infinity;
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
    $changeSizeBy(changeX, changeY){
        if(typeof changeX == 'number' ){
            let _x = changeX;
            let _y = changeY;
            if( changeY == undefined){
                _y = changeX;
            }
            const x = this.$_scale.x + _x;
            const y = this.$_scale.y + _y; 
            this.$setScale(x, y);    
        }else{
            const obj = changeX;
            let _x = obj.x;
            let _y = obj.y;
            const x = this.$_scale.x + _x;
            const y = this.$_scale.y + _y; 
            this.$setScale(x, y);
        }

    }
    $changeEffectBy( target, changeVal) {
        if(target == ImageEffective.COLOR){
            const v = this._effect.color;
            this._effect.color = v + changeVal;
        }else if(target == ImageEffective.FISHEYE ){
            const v = this._effect.fisheye;
            this._effect.fisheye = v + changeVal;
        }else if(target == ImageEffective.WHIRL ){
            const v = this._effect.whirl;
            this._effect.whirl = v + changeVal;
        }else if(target == ImageEffective.PIXELATE ){
            const v = this._effect.pixelate;
            this._effect.pixelate = v + changeVal;
        }else if(target == ImageEffective.MOSAIC ){
            const v = this._effect.mosaic;
            this._effect.mosaic = v + changeVal;
        }else if(target == ImageEffective.BRIGHTNESS ){
            const v = this._effect.brightness;
            this._effect.brightness = v + changeVal;
        }else if(target == ImageEffective.GHOST ){
            const v = this._effect.ghost;
            this._effect.ghost = v + changeVal;
        }

    }
    $setEffectTo( target, val) {
        if(target == ImageEffective.COLOR){
            this._effect.color = val;
        }else if(target == ImageEffective.FISHEYE ){
            this._effect.fisheye = val;
        }else if(target == ImageEffective.WHIRL ){
            this._effect.whirl = val;
        }else if(target == ImageEffective.PIXELATE ){
            this._effect.pixelate = val;
        }else if(target == ImageEffective.MOSAIC ){
            this._effect.mosaic = val;
        }else if(target == ImageEffective.BRIGHTNESS ){
            this._effect.brightness = val;
        }else if(target == ImageEffective.GHOST ){
            this._effect.ghost = val;
        }

    }
    setEffectsEachProperties(_effect) {
        if(ImageEffective.COLOR in _effect ){
            this._effect.color = _effect.color;
        }
        if(ImageEffective.FISHEYE in _effect ){
            this._effect.fisheye = _effect.fisheye;
        }
        if(ImageEffective.WHIRL in _effect ){
            this._effect.whirl = _effect.whirl;
        }
        if(ImageEffective.PIXELATE in _effect ){
            this._effect.pixelate = _effect.pixelate;
        }
        if(ImageEffective.MOSAIC in _effect ){
            this._effect.mosaic = _effect.mosaic;
        }
        if(ImageEffective.BRIGHTNESS in _effect ){
            this._effect.brightness = _effect.brightness;
        }
        if(ImageEffective.GHOST in _effect ){
            this._effect.ghost = _effect.ghost;
        }
    }
    $clearEffect() {
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
        if(name == undefined || typeof name != "string"){
            throw "【Image.add】正しい name を指定してください"
        }
        const ImageError = "【Image.add】正しいイメージデータを指定してください";
        if(image == undefined) throw ImageError
        if(typeof image =="string"){
            if(image.substring(0,4)!="<svg")
                throw ImageError
        }else{
            // 文字列(SVG)でないとき
            if(image.nodeName ){
                if(image.nodeName && image.nodeName !="IMG")
                    throw ImageError
            }else{
                // imageが 文字列(SVG)でない、または、nodeNameがないとき
                throw ImageError
            }
            
        }
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
        if(name == undefined || typeof name != "string"){
            throw "【Sound.add】正しい name を指定してください"
        }
        if(soundData == undefined || soundData.buffer == undefined){
            throw "【Sound.add】正しいサウンドデータを指定してください";
        }
        if ( this.sounds == null ) this.sounds = new Sounds();
        const me = this;
        return new Promise(async resolve => {
            await this.sounds.setSound(name, soundData, options);
            resolve(me);
        })

    }
    async _loadSound(name, soundUrl, options={}) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        if ( this.sounds == null ) this.sounds = new Sounds();
        await this.sounds.loadSound(name,soundUrl, options);
        this.importAllDone[_importIdx] = true;
    }
    $soundSwitch(sound){
        const name = sound.name;
        if ( this.sounds == null ) return;
        this.sounds.switch(name);
    }
    $nextSound() {
        if ( this.sounds == null ) return;
        this.$soundStop();    
        this.sounds.nextSound();
    }
    $soundPlay(sound) {
        if ( this.sounds == null ) return;
        if( sound ) {
            this.$soundSwitch(sound);
        }
        this.sounds.play();
    }
    $setOption(key, value) {
        if( key == SoundOption.VOLUME ){
            this.$setSoundVolume(value);
        }else if(key == SoundOption.PITCH ){
            if( value > 0){
                const _v = value / 100;
                this.$setSoundPitch(_v);    
            }
        }
    }
    $setSoundVolume(volume) {
        if ( this.sounds == null ) return;
        this.sounds.volume = volume;
    }
    $getSoundVolume() {
        return this.sounds.volume;
    }
    // setSoundVolumeByName(name, volume) {
    //     if ( this.sounds == null ) return;
    //     this.sounds.volume = volume;
    // }
    $getSoundPitch() {
        return this.sounds.pitch;
    }
    $setSoundPitch(pitch) {
        if ( this.sounds == null ) return;
        this.sounds.pitch = pitch;
    }
    $soundStop() {
        if ( this.sounds == null ) return;
        this.sounds.stop();
    }
    $soundStopImmediately() {
        if ( this.sounds == null ) return;
        this.sounds.stopImmediately();
    }
    $speechStopImmediately() {
        this.emit("SOUND_STOP"); // ---> スピーチを停止する Soundの中で。
    }
    async $startSoundUntilDone() {
        if ( this.sounds ) await this.sounds.startSoundUntilDone();
        return;
    }
    $setPosition(x, y) {
        if(typeof x == 'number'){
            this.$_position.x = x;
            this.$_position.y = y;    
        }else{
            const obj = x;
            this.$_position.x = obj.x;
            this.$_position.y = obj.y;    
        }
    }

    $setScale(x, y) {
        if(typeof x == 'number'){
            this.$_scale.x = x;
            if( y == undefined) {
                this.$_scale.y = x;
    
            }else{
                this.$_scale.y = y;
            }    
        }else{
            const obj = x;
            this.$_scale.x = obj.x;
            this.$_scale.y = obj.y;

        }
    }
    _directionChange( direction ) {
        if( direction > 180 ) {
            return direction - 360;
        }
        return direction;    
    }
    $setDirection(direction) {
        const _direction = this._directionChange(direction);
        this.$_direction = _direction;
    }

    $turnRight( value ) {
        const _direction = this.$_direction + value;
        this.$setDirection( _direction )
    }

    $turnLeft( value ) {
        const _direction = this.$_direction - value;
        this.$setDirection( _direction )
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

    async $waitSeconds (seconds) {
        await Controls.waitSeconds(seconds);
    }
    async $waitUntil(condition){
        await Controls.waitUntil(condition);
    }
    async $waitWhile(condition){
        await Controls.waitWhile(condition);
    }
    $broadcast(messageId, ...args ) {
        const runtime = PlayGround.default.runtime;
        const eventId = `message_${messageId}`;
        this.modules.set(eventId, []);
        const sendTargets = [];
        runtime.emit(eventId, this.modules, sendTargets, ...args);
    }
    async $broadcastAndWait(messageId, ...args ){
        const wait = Libs.default.wait;
        const runtime = PlayGround.default.runtime;
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
    $broadcastToTargets(messageId, target, ...args) {
        const runtime = PlayGround.default.runtime;
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
    async $broadcastAndWaitToTargets(messageId, target, ...args) {
        const runtime = PlayGround.default.runtime;
        const wait = Libs.default.wait;
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
    $whenBroadcastReceived(messageId, func){
        //const me = this;
        const me = this.getProxyForHat();
        const threadId = me._generateUUID();
        const runtime = PlayGround.default.runtime;
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
                const funcArr = _foundElement.funcArr;
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
        const proxy = funcElement.target;
        //const proxy = me.getProxyForHat();
        proxy.threadId = threadId;
        const obj = proxy.startThreadMessageRecieved(func, proxy, false, ...args);                    
        const promise = new Promise(async resolve=>{
            for(;;){
                if(obj.done){
                    break;
                }
                await Utils.wait(0.1);
            }
            resolve();
        });
        arr.push(promise);
    }
    // すぐに実行する
    $whenRightNow(func) {
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
    async $whenFlag (func) {
        //const process = Process.default;
        const me = this;
        const flag = Element.getControlGreenFlag();
        const clickFunc = async(e)=>{
            me.hatProc(func);
            e.stopPropagation();
        }
//        flag.removeEventListener('click', clickFunc);
        flag.addEventListener('click', clickFunc);
    }
    hatProc(func){
        const me = this;
        const threadId = me._generateUUID();
        const proxy = me.getProxyForHat();
        proxy.threadId = threadId;
        me.startThread(func, proxy);
        return proxy;

    }
    $whenMouseTouched (func) {
        const p = PlayGround.default;
        const me = this;
        Canvas.canvas.addEventListener('mousemove', async(e) => {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            const _touchDrawableId = me.render.renderer.pick(mouseX,mouseY, 3, 3, [me.drawableID]);
            if(me.drawableID == _touchDrawableId){
                if( p.preloadDone === true ) {
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
    $whenCloned(func) {
        const runtime = PlayGround.default.runtime;
        const eventId = `whenClone_${this.name}`;

        runtime.on(eventId, function(clone){
            const threadId = clone._generateUUID();
            const proxy = clone.getProxyForHat();
            proxy.threadId = threadId;
            clone.startThread(func, proxy);
        });
    }
    $isNotMouseTouching() {
        return !(this.isMouseTouching());
    }
    $isMouseTouching() {
        const p = PlayGround.default;
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
    $whenClicked (func) {
        // 同じオブジェクトで前回クリックされているとき
        // 前回のクリックで起動したものを止める。
        const p = PlayGround.default;
        const entityId = this.id;
        const me = this;
        const eventf = async (e)=>{
            e.stopPropagation();
            // 緑の旗押されていないときは何もしない。
            if(p.runningGame === false){
                return;
            }
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
                if( p.preloadDone === true ) {
                    me.startThread(func, proxy, false); //二重起動禁止
                }
            }
        }
        Canvas.canvas.removeEventListener('click', eventf);
        Canvas.canvas.addEventListener('click', eventf);
    }
    $whenTouchingTarget(targets, func) {
        const p = PlayGround.default;
        const me = this;
        if( p.preloadDone === true ) {
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
    $isTouchingTargetToTarget(src, targets) {
        const targetIds = [];
        if(Array.isArray(targets)){
            for(const _t of targets) {
                if(_t.visible){
                    const _drawableId = _t.drawableID;
                    targetIds.push(_drawableId);    
                }
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
    $ifTouchingTarget(target) {
        const touching = this.$isTouchingTargetToTarget(this,[target]);
        return touching;
    }
    $ifTouchingMultiTargets(targets){
        if(Array.isArray(targets)){
            for(const t of targets){
                const touching = this.$ifTouchingTargets(this,t);
                return touching;
            }
        }
        return false;
    }
    $getTouchingTarget(targets) {
        const src = this;
        const touchingTragets = []
        if(Array.isArray(targets)){
            for(const t of targets){
                const touching = this.$isTouchingTargetToTarget(src,t);
                if( touching === true) {
                    touchingTragets.push(t);
                }
            }
        }else{
            const t = targets
            const touching = this.$isTouchingTargetToTarget(src, t);
            if( touching === true) {
                touchingTragets.push(t);
            }
        }

        return touchingTragets;
    }

    isTouchingTarget(targets) {
        const src = this;
        const touching = this.$isTouchingTargetToTarget(src,targets);
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

    $show(){
        this.visible = true;
    }
    $hide(){
        this.visible = false;
    }

    get visible() {
        return this._visible;
    }

    $setRotationStyle () {
        // Spriteクラスで定義する
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
        const src = 'return async function*(){await func(obj.entity,...args); }';
        const f = new Function(["obj", 'func', 'args' ], src);
        const gen = f( obj, func.bind(_entity),  args );
        obj.f = gen();
        threads.registThread( obj );
        return obj;
    }
    
    // これは使わない
    stopThread( t ) {
        clearTimeout( t );
    }
    pointTowardsMouseCursolGlobal( ) {
        const p = PlayGround.default;
        const rect = p.canvas.getBoundingClientRect();

        const canvasGlobalCenterX = rect.x + rect.width/2 // - canvasBorderX;
        const canvasGlobalCenterY = rect.y + rect.height/2 // - canvasBorderY;
    
        const pageX = p.stage.mouse.pageX;
        const pageY = p.stage.mouse.pageY;
    
        const _mouseXG = (pageX - canvasGlobalCenterX );
        const _mouseYG = (canvasGlobalCenterY - pageY);
    
        const _rateX = p._render.stageWidth / p.canvas.width;
        const _rateY = p._render.stageHeight / p.canvas.height;
    
        const targetX = (_mouseXG) * _rateX;
        const targetY = (_mouseYG) * _rateY;

        const dx = targetX - this.$_position.x;
        const dy = targetY - this.$_position.y;

        let direction = 90 - MathUtils.radToDeg(Math.atan2(dy, dx));
        if(direction > 180) {
            direction -= 360;
        }
        this.$_direction = direction;
    
    }
    pointTowardsMouseCursol( ) {
        // CANVAS 外に出てら ポインターを向かない。
        const libs = Libs.default;
        const mousePosition = libs.mousePosition;
        const targetX = mousePosition.x;
        const targetY = mousePosition.y;
        const dx = targetX - this.$_position.x;
        const dy = targetY - this.$_position.y;
        let direction = 90 - MathUtils.radToDeg(Math.atan2(dy, dx));
        if(direction > 180) {
            direction -= 360;
        }
        this.$_direction = direction;
    }
    $_isDrawableActive(drawableID){
        const drawable = this.render.renderer._allDrawables[drawableID];
        if( drawable && drawable._skin ){
            return true;
        }
        return false;
    }
    /**
     * ポジションプロパティを更新する
     * @param {*} x 
     * @param {*} y 
     */
    $setForceXY(x, y) {
        if(this.$_isDrawableActive(this.drawableID)){
            const _renderer = this.render.renderer;
            const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [x, y]);
            this.$_position.x = _position[0];
            this.$_position.y = _position[1];
            _renderer.updateDrawablePosition(this.drawableID, _position);
        }else{
            this.$_position.x = x;
            this.$_position.y = y;
        }

    }
    /**
     * ポジションプロパティを更新する
     * @param {*} x 
     * @param {*} y 
     */
    $setXY(x, y) {
        if(this.$_isDrawableActive(this.drawableID)){
            const _renderer = this.render.renderer;
            const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [x, y]);
            this.$_position.x = _position[0];
            this.$_position.y = _position[1];
            //_renderer.updateDrawablePosition(this.drawableID, _position);
        }else{
            this.$_position.x = x;
            this.$_position.y = y;
        }

    }
    $setX(x) {
        if(this.$_isDrawableActive(this.drawableID)){
            const _renderer = this.render.renderer;
            const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [x, this.$_position.y]);
            this.$_position.x = _position[0];
            this.$_position.y = _position[1];
//             _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
        }else{
            this.$_position.x = x;
        }
       
    }
    $changeX(x) {
        if(this.$_isDrawableActive(this.drawableID)){
            const _renderer = this.render.renderer;
            let _x = this.$_position.x + x;
            const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [_x, this.$_position.y]);
            this.$_position.x = _position[0];
            this.$_position.y = _position[1];
//            _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
        }else{
            this.$_position.x += x;
        }
       
    }
    $setY(y) {
        if(this.$_isDrawableActive(this.drawableID)){
            const _renderer = this.render.renderer;
            const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [this.$_position.x, y]);
            this.$_position.x = _position[0];
            this.$_position.y = _position[1];
//             _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
        }else{
            this.$_position.y = y;
        }

       
    }
    $changeY(y) {
        if(this.$_isDrawableActive(this.drawableID)){
            const _renderer = this.render.renderer;
            let _y = this.$_position.y + y;
            const _position = _renderer.getFencedPositionOfDrawable(this.drawableID, [this.$_position.x, _y]);
            this.$_position.x = _position[0];
            this.$_position.y = _position[1];
//             _renderer.updateDrawablePosition(this.drawableID, _position); // <--- これ、position変化するものすべてに必要なのでは？
        }else{
            this.$_position.y += y;
        }
    }
    $speech(words, properties, gender='male', locale='ja-JP') {
        const _properties = (properties)? properties : {};

        const speech = Speech.getInstance();
        speech.gender = gender;
        speech.locale = locale;
        speech.speech(this, words, _properties);

    }

    async $speechAndWait(words, properties, gender='male', locale='ja-JP') {
        const _properties = (properties)? properties : {};

        const speech = Speech.getInstance();
        speech.gender = gender;
        speech.locale = locale;
        await speech.speechAndWait(this, words, _properties);
    }

    update() {
        if(this.life != Infinity) {
            this.life -= 1 / Libs.default.Env.pace * 1000;
            if( this.life < 0 ) {
                this.remove();
            }    
        }
    }
    remove() {
    
    }

    async forever(func) {
        await Loop.while(true, func, this);
    }
    async while(condition, func) {
        await Loop.while(condition, func, this);
    }
    async repeat(count, func) {
        await Loop.repeat(count, func, this);
    }
    async repeatUntil(condition, func) {
        await Loop.repeatUntil(condition, func, this);
    }

}

module.exports = Entity;
