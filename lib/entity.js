const PlayGround = require('./playGround');

const Canvas = require('./canvas');
const {Controls, Loop} = require('./controls');
const Element = require('./element');
const EntityProxyExt = require('./util/entityProxyExt');
const Env = require('./env');
const EventEmitter = require('events');
const FunctionChecker = require('./util/functionChecker');
const libs = require('./libs');
const MathUtils = require('./math-utils');
const Sounds = require('./sounds');
const Speech = require('./speech/text2Speech');
const threads = require('./threads');
const Utils = require('./utils');

const {ImageEffective, SoundOption, RotationStyle} = require('./entityConstant');


class Entity extends EventEmitter {
    static clickFirstRegist = true;
    static eventFuncArray = [];
    static broadcastReceivedFuncArr = [];
    static get EmitIdMovePromise () {
        return '_MovePromise_';
    }
    get SOUND_FORCE_STOP (){
        return "sound_force_stop";
    }
    constructor (name, layer, options = {} ){
        super();
        this.playGround = PlayGround.default;
        this.pace = Env.pace;
        this.render = this.playGround.render;
        this.name = name;
        this.layer = layer;
        this.drawableID = this.render.createDrawable(this.layer);
        this.id = this._generateUUID();
        this.canvas = Canvas.canvas;
        this.flag = null;//playGround.flag;
        this.$_position = {x:0, y:0}; // 意味なし
        this.$_scale = {w:100,h:100}; // 意味なし
        this.$_direction = 90; // 意味なし
        this._visible = true;
        this.sounds = null;
        //this.sound = null;
        this.importAllDone = [];
        this.importIdx = -1;

        const _effect = (options.effect)? options.effect: {};
        this._effect = {};
        this.setEffectsEachProperties(_effect);
        this.$_position = (options.position)? {x: options.position.x, y: options.position.y}:{x:0, y:0};
        this.$_prev_position = this.$_position;
        this.$_direction = (options.direction)? options.direction : 90;
        this.$_prev_direction = this.$_direction;
        this.$_scale = (options.scale)? {w: options.scale.w, h: options.scale.h} : {w:100, h:100};
        this.$_prev_scale = {w:0, h:0};
        this.$_prev_scale.w = this.$_scale.w;
        this.$_prev_scale.h = this.$_scale.h;

        this.life = Infinity;
        this.modules = new Map();
        Entity.broadcastReceivedFuncArr = Entity.broadcastReceivedFuncArr || [];
        this._isAlive = true;
        // タイマー用
        this._timer = performance.now();
    }
    isAlive() {
        // スプライトの場合はオーバーライドしている
        return true;
    }
    isSprite() {
        return true;
    }
    $delete () {
        delete this.modules;
    }
    get effect() {
        return this._effect;
    }
    set effect(_effect) {
        this.setEffectsEachProperties(_effect);
    }
    $changeSizeBy(changeW, changeH) {
        if(typeof changeW == 'number' ){
            let _w = changeW;
            let _h = changeH;
            if( changeH == undefined){
                _h = changeW;
            }
            const w = this.$_scale.w + _w;
            const h = this.$_scale.h + _h; 
            this.$setScale(w, h);    
        }else{
            const obj = changeW;
            let _w = obj.w;
            let _h = obj.h;
            const w = this.$_scale.w + _w;
            const h = this.$_scale.h + _h; 
            this.$setScale(w, h);
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
    // async importSound( sound ) {
    //     if ( this.sounds == null ) this.sounds = new Sounds(this);
    //     const soundData = await this.sounds.importSound( sound );
    //     return soundData;
    // }
    async _addSound(name, soundData, options={}) {
        if(name == undefined || typeof name != "string"){
            throw "【Sound.add】正しい name を指定してください"
        }
        if(soundData == undefined || soundData.buffer == undefined){
            throw "【Sound.add】正しいサウンドデータを指定してください";
        }
        if ( this.sounds == null ) this.sounds = new Sounds(this);
        const me = this;
        return new Promise(async resolve => {
            if(this.sounds == undefined) throw 'sounds undefined error';
            await this.sounds.setSound(name, soundData, options);
            resolve(me);
        })

    }
    async _loadSound(name, soundUrl, options={}) {
        this.importIdx += 1;
        const _importIdx = this.importIdx;
        this.importAllDone.push(false);
        if ( this.sounds == null ) this.sounds = new Sounds(this);
        await this.sounds.loadSound(name,soundUrl, options);
        this.importAllDone[_importIdx] = true;
    }
    $soundSwitch(sound) {
        if(this.sounds == undefined) throw 'sounds undefined error';
        if(this.sounds.soundPlayer == undefined) throw 'sounds.soundPlayer undefined error';
        const name = sound.name;
        if(this.sounds.soundPlayer.name===name) return;
        const keys = this.sounds.getSoundKeys();
        if(keys.includes(name)){
            this.sounds.switch(name);
        }else{
            throw '指定したサウンドは定義されていません('+name+')';
        }
    }
    $nextSound() {
        if ( this.sounds == null ) return;
        this.$soundStop();    
        this.sounds.nextSound();
    }
    $soundPlay(name) {
        if(this.sounds == undefined) throw 'sounds undefined error';
        if( name ) {
            this.$soundSwitch({name:name});
        }

        this.sounds.play();
    }
    async $setOption(key, value) {
        if( key == SoundOption.VOLUME ){
            this.$setSoundVolume(value);
        }else if(key == SoundOption.PITCH ){
            if( -360 <= value && value <= 360 ){
                this.$setSoundPitch(value);    
            }
        }
        // 音量変更時直後の再生にて 最初に雑音「ブッ」が入る。
        // FPS分待つことで解消させる
        await libs.default.wait(1000/33*2);
    }
    async $clearSoundEffect() {
        this.$setSoundVolume(100);
        this.$setSoundPitch(0);
        await libs.default.wait(1000/33*2);
    }
    $pitchAudio2Scratch(pitch) {
        if(12.5 <= pitch && pitch <= 800){
            const scratchPitch = 120 * Math.log2(pitch/100);
            return scratchPitch;
        }
        return 100;
    }
    $pitchScratch2Audio(pitch) {
        if(-360 <= pitch && pitch <= 360) {
            const audioPitch = 100 * (2**(pitch/120));
            return audioPitch;
        }
        return 0;
    }
    async $changeOptionValue(key, value) {
        if(this.sounds == undefined) throw 'sounds undefined error';
        if( key == SoundOption.VOLUME ){
            const volume = this.sounds.volume;
            this.$setSoundVolume(volume + value);
        }else if(key == SoundOption.PITCH ){
            const changePitch = this.$pitchScratch2Audio(value);
            const pitch = this.sounds.pitch + changePitch;
            if( 12.5 <= pitch && pitch <= 800 ){
                const pitchScratch = this.$pitchAudio2Scratch(pitch);
                this.$setSoundPitch( pitchScratch );
            }
        }
        // 音量変更時直後の再生にて 最初に雑音「ブッ」が入る。
        // FPS分待つことで解消させる
        await libs.default.wait(1000/33*2);
    }
    $setSoundVolume(volume) {
        if ( this.sounds == null ) return;
        this.sounds.volume = volume;
    }
    $getSoundVolume() {
        if(this.sounds == undefined) throw 'Sounds undefined error';
        return this.sounds.volume;
    }
    // setSoundVolumeByName(name, volume) {
    //     if ( this.sounds == null ) return;
    //     this.sounds.volume = volume;
    // }
    $getSoundPitch() {
        if(this.sounds == undefined) throw 'sounds undefined error';
        return this.sounds.pitch;
    }
    $setSoundPitch(pitch) {
        if(this.sounds == undefined) throw 'sounds undefined error';
        const audioPitch = this.$pitchScratch2Audio(pitch);
        this.sounds.pitch = audioPitch/100;
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
        this.emit(this.SOUND_FORCE_STOP); // ---> スピーチを停止する Soundの中で。
    }
    async $startSoundUntilDone(name) {
        if ( this.sounds ) {
            if(name){
                this.$soundSwitch({name:name});
            }
            await this.sounds.startSoundUntilDone();
        }
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

    $setScale(w, h) {
        if(typeof w == 'number'){
            this.$_scale.w = w;
            if( h == undefined) {
                this.$_scale.h = w;
    
            }else{
                this.$_scale.h = h;
            }    
        }else{
            const obj = w;
            this.$_scale.w = obj.w;
            this.$_scale.h = obj.h;

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
    async $waitUntil(condition) {
        await Controls.waitUntil(condition);
    }
    async $waitWhile(condition) {
        await Controls.waitWhile(condition);
    }
 
    $isNotMouseTouching() {
        return !(this.$isMouseTouching());
    }
    $isMouseTouching() {
        if(this.playGround.render){
            const mouseX = this.playGround.stage.mouse.x +1; // +1 は暫定、理由不明
            const mouseY = this.playGround.stage.mouse.y +1;
            if(this.playGround.render.renderer){
                const _touchDrawableId = this.playGround.render.renderer.pick(mouseX,mouseY, 2, 2, [this.drawableID]); 
                if(this.drawableID == _touchDrawableId){
                    return true;
                }    
            }
        }
        return false;

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
            const target = targets;
            const _drawableId = target.drawableID;
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
    $ifTouchingMultiTargets(targets) {
        if(Array.isArray(targets)){
            for(const t of targets){
                const touching = this.$ifTouchingTarget(t);
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
     * 指定した色に触れているかを判定する
     * @param {string} targetRgb #始まりのカラー文字列
     * @returns {Promise.<boolean>} 色にタッチしたとき true
     */
    async $isTouchingColor(targetRgb) {
        if(this.render && this.render.renderer && targetRgb &&
            typeof targetRgb === 'string' && targetRgb.substring(0, 1) === '#'
        ){
            const _renderer = this.render.renderer;
            const _targetRgb = libs.default.Cast.toRgbColorObject(targetRgb);
            return await _renderer.isTouchingColor(this.drawableID, _targetRgb);
        }
        return false;
    }
    /**
     * 自身の色(maskRgb)が指定色(targetRgb)に触れているかを判定する
     * @param {Array.<number>} targetRgb [r,g,b] 0 - 255
     * @param {Array.<number>} maskRgb 
     * @returns 
     */
    async $colorIsTouchingColor(targetRgb, maskRgb) {
        if(this.render && this.render.renderer && 
            targetRgb && typeof targetRgb === 'string' && targetRgb.substring(0, 1) === '#' &&
            maskRgb && typeof maskRgb === 'string' && maskRgb.substring(0, 1) === '#'
        ){
            const _renderer = this.render.renderer;
            const _targetRgb = libs.default.Cast.toRgbColorObject(targetRgb);
            const _maskRgb = libs.default.Cast.toRgbColorObject(maskRgb);
            return await _renderer.isTouchingColor(this.drawableID, 
                                    _targetRgb, 
                                    _maskRgb);
        }
        return false;
    }

    $broadcast(messageId, ...args ) {
        const runtime = this.playGround.runtime;
        if(runtime){
            const eventId = `message_${messageId}`;
            if(this.modules == undefined) this.modules = new Map();
            this.modules.set(eventId, []);
            const sendTargets = [];
            runtime.emit(eventId, this.modules, sendTargets, ...args);    
        }
    }
    async $broadcastAndWait(messageId, ...args ) {
        const wait = libs.default.wait;
        const runtime = this.playGround.runtime;
        if(runtime){
            const eventId = `message_${messageId}`;
            if(this.modules == undefined) this.modules = new Map();
            this.modules.set(eventId, []);
            const sendTarges = [];
            runtime.emit(eventId, this.modules, sendTarges, ...args);
            await wait(10);
            const promises = this.modules.get(eventId);
            if(promises && promises.length > 0) {
                await Promise.all(promises);
                return;
            }    
        }
    }
    // $broadcastToTargets(messageId, target, ...args) {
    //     const runtime = playGround.runtime;
    //     if(runtime){
    //         const eventId = `message_${messageId}`;
    //         this.modules.set(eventId, []);
    //         const _targets:Entity[] = [];
    //         if( Array.isArray(target) ) {
    //             target.map(v=>{
    //                 if( v instanceof Entity) {
    //                     _targets.push(v);
    //                 }
    //             })
    //         }else{
    //             const _target = target;
    //             if( _target instanceof Entity) {
    //                 _targets.push(_target);
    //             }
    //         }
    //         if(sendTargets.length > 0) {
    //             runtime.emit(eventId, this.modules, _targets, ...args);
    //         }     
    //     }
    // }
    // async $broadcastAndWaitToTargets(messageId, target:Entity|Entity[], ...args) {
    //     const runtime = playGround.runtime;
    //     if(runtime){
    //         const wait = Libs.default.wait;
    //         const eventId = `message_${messageId}`;
    //         this.modules.set(eventId, []);
    //         const _targets:Entity[] = [];
    //         if( Array.isArray(target) ) {
    //             target.map(v=>{
    //                 if( v instanceof Entity) {
    //                     _targets.push(v);
    //                 }
    //             })
    //         }else{
    //             const _target = target;
    //             if( _target instanceof Entity) {
    //                 _targets.push(_target);
    //             }
    //         }
    //         if(sendTargets.length > 0) {
    //             runtime.emit(eventId, this.modules, _targets, ...args);
    //             await wait(10);
    //             const promises = this.modules.get(eventId);
    //             if(promises.length > 0) {
    //                 await Promise.all(promises);
    //                 return;
    //             }
    //         }    
    //     }
    // }

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
        const runtime = this.playGround.runtime;
        if(runtime){
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
            if(_foundElement != undefined){
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
                    if(_foundElement){
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
                    }
                });
            }    
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
        obj.originalF = func;
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
        const functionDeclareType = FunctionChecker.getFunctionDeclares(func);
        if( functionDeclareType.isArrow === true ){
            // アロー関数は許可しない
            console.log(func.toString());
            throw "イベントで宣言する関数は アロー関数を使ってはいけません。";
        }
        if( functionDeclareType.isAsync === false){
            // async でないときは許可しない
            console.log(func.toString());
            throw "イベントで宣言する関数は async をつけてください。";
        }
        if( functionDeclareType.isGenerator === true){
            // Generator は許可しない
            console.log(func.toString());
            throw "WhenRightNowイベントで宣言する関数は Generatorを使えません";
        }
        const me = this;
        setTimeout(async _=>{
            const _p = this.playGround;
            const wait = libs.default.wait;
            const f = func.bind(me);
            await f(me);
            /**
             * 1FPS後にDrawするとちょうどよさげ
             */
            //await wait(33);
            await wait(5);
            _p._draw();
        },0);
    }
    $broadCastBackdropSwitch(backdropName) {
        const messageId = `BackdropSwitches_${backdropName}`;
        this.$broadcast(messageId, backdropName);
    }
    /**
     * 背景が〇〇になったときの動作
     * @param {*} backdropName 
     * @param {*} func 
     */
    $whenBackdropSwitches(backdropName, func) {
        // Stage#nextBackDrop(), Stage#switchBackDrop() にて
        // 変更前のbackdropName と 変更後のbackdropName を比較し
        // 異なる場合、変更後のbackdropNameを使ったメッセージID で emit する
        // ここでは on でメッセージを受け取るが、
        // Entity#whenBroadcastReceived() と同様の処理にする
        const EmitId = `BackdropSwitches_${backdropName}`;
        this.$whenBroadcastReceived(EmitId, func);    
    }

    getProxyForHat(){

        const proxy = EntityProxyExt.getProxy(this, _=>{
            throw 'NOT FOUND PROPERTY in TARGET';
        });
        //console.log('proxy.stop_this_script_switch='+proxy.stop_this_script_switch)
        return proxy;
    }
    async $whenFlag (func) {
        //const process = Process.default;
        const me = this;
        const flag = Element.getControlGreenFlag();
        const clickFunc = async(e)=>{
            me.hatProc(func, me);
            e.stopPropagation();
        }
        flag.addEventListener('click', clickFunc);
    }
    hatProc(func, self){
        const me = (self)? self : this;
        const threadId = me._generateUUID();
        const proxy = me.getProxyForHat();
        proxy.threadId = threadId;
        me.startThread(func, proxy);
        return proxy;

    }

    $whenKeyPressed( key, func ) {
        const me = this;
        const p = this.playGround;
        const runtime = p.runtime;
        if(key && func && runtime) {
            runtime.on("KEY_PRESSED", function(pressedKey){
                if( key === pressedKey) {
                    if(p.runningGame === false){
                        return; // 緑の旗が押されていないときは何もしない
                    }
                    // whenClicked と同じ処理
                    const addId = `_keyPressed_${key}`;
                    const entityId = me.id + addId;
                    threads.removeObjById(entityId); // 前回のキープレス分を止める
                    const threadId = me._generateUUID();
                    const proxy = me.getProxyForHat();
                    proxy.threadId = threadId;
                    if( p.preloadDone === true ) {
                        me.startThread(func, proxy, false, addId); //二重起動禁止
                    }
                }
            });
        }
    }
    /**
     * whenClickedが二重に呼ばれたときは
     * 前回動作しているスレッドを停止させる。
     * @param {function} func 
     */
    $whenClicked (func) {
        // 同じオブジェクトで前回クリックされているとき
        // 前回のクリックで起動したものを止める。
        const p = this.playGround;
        const addId = '_clicked';
        const me = this;
        const _clickEventF = async (e)=>{
            e.stopPropagation();
            // 緑の旗押されていないときは何もしない。
            if(p.runningGame === false){
                return;
            }
            let _counter = 0;
            for(const eventf of Entity.eventFuncArray){
                _counter += 1;
                eventf(e, _counter);
            }
        }
        const eventf = async (e, _counter)=>{
            const CLICK_COUNTER = _counter; //Entity._clickCounter;
            const entityId = me.id + addId;
            e.stopPropagation();
            // 緑の旗押されていないときは何もしない。
            if(p.runningGame === false){
                return;
            }
            //threads.removeObjById(entityId); // 前回のクリック分を止める。
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            // クリックしたポイントにあるDrawableのうち一番前面にあるものを返す。
            // そのポイントにDrawableがないときは Falseが返る。
            // 第三引数を省略することで全ての表示中のDrawableから探す。
            const _touchDrawableId = me.render.renderer.pick(mouseX,mouseY, 3, 3);
            if(me.drawableID == _touchDrawableId){
                // 前回のクリック分を止める。
                // me.$soundStopImmediately();
                // me.$speechStopImmediately();

                threads.removeObjById(entityId, CLICK_COUNTER); // 前回のクリック分を止める。
                const threadId = me._generateUUID();
                const proxy = me.getProxyForHat();
                proxy.threadCounter = CLICK_COUNTER;
                proxy.threadId = threadId;
                if( p.preloadDone === true ) {
                    me.startThread(func, proxy, false, addId); //二重起動禁止
                }
            }
        }
        Entity.eventFuncArray.push(eventf);
        //Canvas.canvas.removeEventListener('click', eventf);
//        Canvas.canvas.addEventListener('click', eventf);
        if(Entity.clickFirstRegist === true && Canvas.canvas){
            Canvas.canvas.addEventListener('click', _clickEventF);
            Entity.clickFirstRegist = false;
        }
    }

    $whenCloned(func) {
        const runtime = this.playGround.runtime;
        if(runtime){
            const eventId = `whenClone_${this.name}`;
            runtime.on(eventId, function(clone){
                const threadId = clone._generateUUID();
                const proxy = clone.getProxyForHat();
                proxy.threadId = threadId;
                clone.startThread(func, proxy);
            });    
        }
    }
    updateVisible( visible ) {
        this._visible = visible;
        this.render.renderer.updateDrawableVisible(this.drawableID, visible);
    }

    set visible( _visible ){
        this.updateVisible(_visible);
    }

    $show() {
        this.visible = true;
    }
    $hide() {
        this.visible = false;
    }

    get visible() {
        return this._visible;
    }
    /**
     * @abstract
     */
    $setRotationStyle ( style ) {
        // Spriteクラスで定義する
    }
    /**
     * func はGeneratorの前提
     * @param {*} func 
     * @param {Entity} entity 
     * @param {boolean} doubleRunable 
     * @returns 
     */
    startThread( func, entity , doubleRunable=true, addId = '') {

        const functionDeclareType = FunctionChecker.getFunctionDeclares(func);
        if( functionDeclareType.isArrow === true ){
            // アロー関数は許可しない
            console.log(func.toString());
            throw "イベントで宣言する関数は アロー関数を使ってはいけません。";
        }
        if( functionDeclareType.isAsync === false){
            // async でないときは許可しない
            console.log(func.toString());
            throw "イベントで宣言する関数は async をつけてください。";
        }
        const _entity = entity;

        // @ts-ignore (proxy properties undefined error)
        const threadId = _entity.threadId;

        const obj = threads.createObj();
        obj['entityId'] = _entity.id + addId;
        obj.threadId = threadId; //this.id;
        obj['entity'] = _entity;
        obj.doubleRunable = doubleRunable;
        if(functionDeclareType.isGenerator){
            const _func = func.bind(_entity)
            const _func2 = _func(_entity);
            const _f = async function* (){
                try{
                    yield *_func2; // generator()
                }catch(e){
                    if(e!==threads.THROW_STOP_THIS_SCRIPTS){
                        console.log(e);
                    }
                    throw e;
                }
            }
            obj.f = _f();
            
        }else{            
            const _func = func.bind(_entity)
            const f = async function*(){
                try{
                    await _func(_entity);
                }catch(e){
                    if(e!==threads.THROW_STOP_THIS_SCRIPTS){
                        console.log(e);
                    }
                    throw e;
                }
            }
            obj.f = f();    
        }
        obj.originalF = func;
        threads.registThread( obj );
        return obj;
    }
    startThreadMessageRecieved( func, entity , doubleRunable=true, ...args) {
        const functionDeclareType = FunctionChecker.getFunctionDeclares(func);
        if( functionDeclareType.isArrow === true ){
            // アロー関数は許可しない
            console.log(func);
            throw "イベントで宣言する関数は アロー関数を使ってはいけません。";
        }
        if( functionDeclareType.isAsync === false){
            // async でないときは許可しない
            console.log(func.toString());
            throw "イベントで宣言する関数は async をつけてください。";
        }

        const _entity = entity;

        // @ts-ignore (proxy properties undefined error)
        const threadId = _entity.threadId;

        const obj = threads.createObj();
        obj.entityId = _entity.id;
        obj.threadId = threadId; //this.id;
        obj.entity = _entity;
        obj.doubleRunable = doubleRunable;
        if(functionDeclareType.isGenerator){
            const _func = func.bind(_entity)
            obj.f = _func(...args); // generator()
        }else{
            const _func = func.bind(_entity)
            const f = async function*(){
                await _func(...args);
            }
            obj.f = f();
        }

        threads.registThread( obj );
        return obj;
    }
    /**
     * @throws THROW_STOP_THIS_SCRIPTS
     */
    $stopThisScript() {
        throw threads.THROW_STOP_THIS_SCRIPTS;
    }
    $stopOtherScripts() {
        threads.stopOtherScripts(this);
    }
    // これは使わない
    stopThread( t ) {
        clearTimeout( t );
    }
    pointTowardsMouseCursolGlobal( ) {
        const p = this.playGround;
        if(p.canvas){
            const rect = p.canvas.getBoundingClientRect();

            const canvasGlobalCenterX = rect.x + rect.width/2 // - canvasBorderX;
            const canvasGlobalCenterY = rect.y + rect.height/2 // - canvasBorderY;
        
            const pageX = p.stage.mouse.pageX;
            const pageY = p.stage.mouse.pageY;
        
            const _mouseXG = (pageX - canvasGlobalCenterX );
            const _mouseYG = (canvasGlobalCenterY - pageY);
            if(p.render){
                const _rateX = p.render.stageWidth / p.canvas.width;
                const _rateY = p.render.stageHeight / p.canvas.height;
            
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
        }
    
    }
    pointTowardsMouseCursol( ) {
        // CANVAS 外に出てら ポインターを向かない。
        const mousePosition = libs.default.mousePosition;
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
    $_isDrawableActive(drawableID) {
        const drawable = this.render.renderer._allDrawables[drawableID];
        if( drawable && drawable._skin ){
            return true;
        }
        return false;
    }
    /**
     * ポジションプロパティを更新する
     * @param {number} x 
     * @param {number} y 
     */
    $setForceXY(x, y)  {
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
     * @param {number} x 
     * @param {number} y 
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
            this.life -= 1 / libs.default.Env.pace * 1000;
            if( this.life < 0 ) {
                this.remove();
            }    
        }
    }
    remove() {
    
    }
    
    get Mouse() {
        const me = this;
        const mousePosition = { 
            "x" : 0,
            "y" : 0,
        };
        Object.defineProperty(mousePosition, "x", {
            get : function() {
                return me.$mouseX;
            },
        })
        Object.defineProperty(mousePosition, "y", {
            get : function() {
                return me.$mouseY;
            },
        })

        return mousePosition;
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
    /**
     * キーが押されたとき
     * @param {*} key 
     * @returns {boolean}
     */
    $isKeyDown( key ) {
        return libs.default.keyIsDown(key);
    }
    /**
     * キーが押されていない
     * @param {*} key 
     * @returns {boolean}
     */
    $isKeyNotDown( key ) {
        return libs.default.keyIsNotDown(key);
    }
    get $mouseX() {
        const mousePosition = libs.default.mousePosition;
        return mousePosition.x;
    }
    get $mouseY() {
        const mousePosition = libs.default.mousePosition;
        return mousePosition.y;
    }

    $resetTimer() {
        this._timer = performance.now();
    }
    get $timer() {
        return performance.now() - this._timer;
    }

    $isMouseDown() {
        return libs.default.mouseIsPressed();
    }
    $stopAll() {
        Element.stopAll();
        const runtime = this.playGround.runtime;
        if(runtime){
            const EmitID_GREEN_MARK_BUTTON_ENABLED = runtime.GREEN_BUTTON_ENABLED;
            runtime.emit(EmitID_GREEN_MARK_BUTTON_ENABLED);    
        }
    }
};
module.exports = Entity;