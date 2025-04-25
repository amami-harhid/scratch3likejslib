const Bubble = require('./bubble');
const Entity = require('./entity');
const Env = require('./env');
const Libs = require('./libs');
//const {ImageEffective, SoundOption, RotationStyle} = require('./types');
const MathUtils = require('./math-utils');
const PlayGround = require('./playGround');
const QuestionBoxElement = require('./io/questionBoxElement');
const StageLayering = require('./stageLayering');
const Utils = require('./utils');
const Sprite = class extends Entity {

    constructor(name, options = {}) {
        if(typeof name != "string") throw "第一パラメータはスプライトの名前が必要"
        super(name, StageLayering.SPRITE_LAYER, options);
        const stage = PlayGround.default.stage;
        this.stage = stage;
        this.bubble = new Bubble(this);
        this.costumes = new Libs.default.Costumes();
        this.skinId = null;
        this.skinIdx = -1;
        this.z = -1;
        this.clones = [];
        this.isClone;
        this.originalSprite;
        this.imageDatas = [];
        this.soundDatas = [];
        this.touchingEdge = false;
        this.bubbleDrawableID = null;
        this._isAlive = true;
        stage.addSprite(this);

    }
    $delete () {
        super.$delete();
        this.bubble = null;
        delete this.bubble;
        this.costumes = null;
        delete this.costumes;
        this.clones = null;
        delete this.clones;
        this.originalSprite = null;
        delete this.originalSprite;
        this.imageDatas = null;
        delete this.imageDatas;
        this.soundDatas = null;
        delete this.soundDatas;
        this._isAlive = false;
    }
    $remove() {
        if(this._isAlive === false) return;
        if(this.isClone === true && this.originalSprite && this.originalSprite.clones) {
            const clones = this.originalSprite.clones;
            this.originalSprite.clones = clones.filter(s=> s.id !== this.id);
        }
        this.stage.removeSprite(this);
        try{
            this.render.renderer.destroyDrawable(this.drawableID, StageLayering.SPRITE_LAYER);

        }catch(e){
            
        }finally{
            this._isAlive = false;
        }
        
        this.costumes.destroyAllSkin();

        this.$delete();
    }

    $isAlive() {
        return this._isAlive ==  true;
    }
    /**
     * クローンして 処理を実行する
     * @param {*} options 
     * @param {*} func 
     */
    /*
    cloneThen(options, func){
        
        this.clone(options).then(async v=>{

            v.hatProc(func);

        });
    }
    */
    async $cloneAndWait(options = {}){
        await this.$clone(options);
    }
    async $clone(options = {}) {
        if(this.isClone == undefined){
            const newName = `${this.name}_${this.clones.length+1}`;
            // クローン時にエフェクトを引き継ぐ。
            // クローン別にエフェクトを設定したいときは
            // clone() 実行後に 個別に設定すること。
            // const COLOR = ImageEffective.COLOR;
            // const FISHEYE = ImageEffective.FISHEYE;
            // const WHIRL = ImageEffective.WHIRL;
            // const PIXELATE = ImageEffective.PIXELATE;
            // const MOSAIC = ImageEffective.MOSAIC;
            // const BRIGHTNESS = ImageEffective.BRIGHTNESS;
            // const GHOST = ImageEffective.GHOST;
            const _options = {
                'position' : {x: this.$_position.x, y:this.$_position.y}, 
                'scale' : this.$_scale,
                'direction' : (this.$_direction)? this.$_direction: 90,
                COLOR : (this._effect.color)? this._effect.color: 0,
                FISHEYE : (this._effect.fisheye)? this._effect.fisheye: 0,
                WHIRL: (this._effect.whirl)? this._effect.whirl: 0,
                PIXELATE: (this._effect.pixelate)? this._effect.pixelate: 0,
                MOSAIC: (this._effect.mosaic)? this._effect.mosaic: 0,
                BRIGHTNESS: (this._effect.brightness)? this._effect.brightness: 0,
                GHOST: (this._effect.ghost)? this._effect.ghost: 0,
            };
            const newOptions = Object.assign(_options, options);
            const newSprite = new this.constructor(newName, newOptions);
            // デフォでは本体の前に表示されるので、1つ背面へ移動する
            newSprite.$goBackwardLayers(1)
            //const _visible = 
            newSprite.$setVisible( false );
            this.clones.push(newSprite);
            newSprite.isClone = true;
            for(const d of this.imageDatas) {
                // svg image の場合、createSVGSkin の中で非同期になることに注意すること
                await newSprite.$addImage(d); 
            }
            let _name = this.costumes.currentSkinName();
            if( _name != null && newSprite.costumes){
                newSprite.costumes.switchCostumeByName(_name);
            }
            for(const d of this.soundDatas) {
                const _soundData = {};
                _soundData.name = d.name;
                _soundData.data = d.data;
                //const _options = d.options;
                await newSprite.$addSound(_soundData);
                // options引き継ぐ
                const _vol = this.$getSoundVolume();
                const _pitch = this.$getSoundPitch();
                newSprite.$setSoundVolume( _vol );
                newSprite.$setSoundPitch( _pitch );       
            }
            newSprite.update(); // update() は不要かもしれない。
            newSprite.originalSprite = this;

            // 注意： Scratch3 風に Sprite duplicate をしてみたい。（調べる）
            // whenClone
            // ここで emit 
            // target( = EventEmitter ) を作る。target は renderer を操作するメソッドを持つ。
            // rendererを操作する処理は emit で行う。
            const runtime = PlayGround.default.runtime;
            const eventId = `whenClone_${this.name}`;
            runtime.emit(eventId, newSprite);
            return newSprite;
        }
    }
    _costumeProperties(target) {
        // スプライトを消すとき costumes はnullになるので 例外回避する
        if(target.costumes) {
            target.costumes.setPosition(target.$_position.x, target.$_position.y);
            target.costumes.setScale(target.$_scale.w, target.$_scale.h);
            target.costumes.setDirection(target.$_direction);
            target.costumes.update(target.drawableID, this._effect);    
        }
        target.$_prev_position.x = target.$_position.x;
        target.$_prev_position.y = target.$_position.y;
        target.$_prev_scale.w = target.$_scale.w;
        target.$_prev_scale.h = target.$_scale.h;
        target.$_prev_direction = target.$_direction;

    }
    _goLayers(nLayers){
        if (this.render.renderer) {
            this.render.renderer.setDrawableOrder(this.drawableID, nLayers, StageLayering.SPRITE_LAYER, true);
        }
    }
    $goToFront() {
        this._goLayers(Infinity); // 最上位
    }
    $goToBack() {
        this._goLayers(-Infinity); // 最下位
    }
    $goForwardLayers (nLayers) {
        this._goLayers(nLayers);
    }
    $goBackwardLayers (nLayers) {
        this._goLayers(-nLayers);
    }
    update() {
        super.update();
        const _renderer = this.render.renderer;
        this._costumeProperties(this);
        //_renderer.updateDrawablePosition(this.drawableID, this.$_position);
        // スプライトを消すとき bubbleを参照できない
        if(this.bubble){
            if(Env.bubbleScaleLinkedToSprite === true) {
                this.bubble.updateScale(this.$_scale.w, this.$_scale.h);
            }
            this.bubble.moveWithSprite();    
        }
    }
    $moveSteps(steps) {
        const radians = MathUtils.degToRad(90 - this.$_direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        this.$setXY( this.$_position.x + dx, this.$_position.y + dy );
    
    }
    $setScale(w, h) {
        if(Utils.isNumber(w)){
            super.$setScale(w,h);
            this.bubble.setScale(w, h);
        }else{
            const obj = w;
            super.$setScale(obj.w,obj.h);
            this.bubble.setScale(obj.w, obj.h);
        }
        this.update();
    }
    get x(){
        return this.$_position.x;
    }
    set x( x ){
        this.$setX(x);
    }
    get y(){
        return this.$_position.y;
    }
    set y( y ){
        this.$setY(y);
    }
    $goToXY( x, y ) {
        if(Utils.isNumber(x)) {
            if ( !Utils.isNumber(y)) {
                return;
            }
            this.$setXY( x, y );    
        }else{
            const obj = x;
            this.$setXY( obj.x, obj.y );    
        }

    }
    $moveTo( x, y ) {
        this.$goToXY( x, y );       
    }
    $_onEdgeBounds() {
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if( drawable == null || drawable.skin == null) return null;
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if (!bounds) return null;
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;
        const distLeft = Math.max(0, (stageWidth / 2) + bounds.left);
        const distTop = Math.max(0, (stageHeight / 2) - bounds.top);
        const distRight = Math.max(0, (stageWidth / 2) - bounds.right);
        const distBottom = Math.max(0, (stageHeight / 2) + bounds.bottom);
        // find nearest edge
        let nearestEdge = '';
        let minDist = Infinity;
        if (distLeft < minDist) {
            minDist = distLeft;
            nearestEdge = 'left';
        }
        if (distTop < minDist) {
            minDist = distTop;
            nearestEdge = 'top';
        }
        if (distRight < minDist) {
            minDist = distRight;
            nearestEdge = 'right';
        }
        if (distBottom < minDist) {
            minDist = distBottom;
            nearestEdge = 'bottom';
        }
        if (minDist > 0) {
            return null// Not touching any edge
        }
        return {'minDist': minDist, 'nearestEdge':nearestEdge};
    }
    // #_ifOnEdgeBounds() {
    //     const judge = this.#onEdgeBounds();
    //     if(judge &&  judge.minDist && judge.minDist == Infinity) return null;
    //     return judge;
    // }
    $ifOnEdgeBounds() {
        this.$_ifOnEdgeBounds();
    }
    $_ifOnEdgeBounds() {
//        this._ifOnEdgeBoundsFlag = false;
        if(!this.$isAlive()) return;
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if( drawable == null || drawable.skin == null) return;
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if (!bounds) return;
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;
        const distLeft = Math.max(0, (stageWidth / 2) + bounds.left);
        const distTop = Math.max(0, (stageHeight / 2) - bounds.top);
        const distRight = Math.max(0, (stageWidth / 2) - bounds.right);
        const distBottom = Math.max(0, (stageHeight / 2) + bounds.bottom);
        // find nearest edge
        let nearestEdge = '';
        let minDist = Infinity;
        if (distLeft < minDist) {
            minDist = distLeft;
            nearestEdge = 'left';
        }
        if (distTop < minDist) {
            minDist = distTop;
            nearestEdge = 'top';
        }
        if (distRight < minDist) {
            minDist = distRight;
            nearestEdge = 'right';
        }
        if (distBottom < minDist) {
            minDist = distBottom;
            nearestEdge = 'bottom';
        }
        if (minDist > 0) {
            return;// Not touching any edge
        }
//        this._ifOnEdgeBoundsFlag = true;// 端にふれている。
        // Point away from the nearest edge.
        const radians = MathUtils.degToRad(90 - this.$_direction);
        let dx = Math.cos(radians);
        let dy = -Math.sin(radians);
        if (nearestEdge === 'left') {
            dx = Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === 'top') {
            dy = Math.max(0.2, Math.abs(dy));
        } else if (nearestEdge === 'right') {
            dx = 0 - Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === 'bottom') {
            dy = 0 - Math.max(0.2, Math.abs(dy));
        }
        const newDirection = MathUtils.radToDeg(Math.atan2(dy, dx)) + 90;
        this.$_direction = newDirection;
        // Keep within the stage.
        if(this.costumes ) {
//            this.$_keepInFence(this.costumes._position.x, this.costumes._position.y);
            this.$_keepInFence(this.$_position.x, this.$_position.y);
        }
        /* 
        for(;;) {
            this.keepInFence(this.costumes._position.x, this.costumes._position.y);
            const touch = this.isTouchingEdge();
            if( touch === false ) break;
            await Utils.wait(0);
        }
        */

    }
    $isTouchingTargetToTarget(targets) {
        let _targets;
        if(Array.isArray(targets)){
            _targets = [...targets];
        }else{
            _targets = [targets];
        }
        for(const t of _targets){
            if(t.clones){
                for(const c of t.clones){
                    _targets.push(c);
                }    
            }
        }

        const touch = super.$isTouchingTargetToTarget(this, _targets);
        return touch;
    }
    $_keepInFence(x, y) {
        if(!this.$isAlive()) return;
        const fencedPosition = this.$_keepInFencePosition(x, y);
        if(fencedPosition){
            // this._ifOnEdgeBoundsPosition.x = fencedPosition[0];
            // this._ifOnEdgeBoundsPosition.y = fencedPosition[1];
            this.$_position.x = fencedPosition[0];
            this.$_position.y = fencedPosition[1];
        }
    }
    $_keepInFencePosition(newX,newY){
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if( drawable == null || drawable.skin == null) return;
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if(!bounds) return;
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;

        const fence = {
            left: -(stageWidth / 2),
            top: stageHeight / 2,
            right: stageWidth / 2,
            bottom: -(stageHeight / 2),
        };
        // Adjust the known bounds to the target position.
        if(this.costumes){
            bounds.left += (newX - this.costumes._position.x);
            bounds.right += (newX - this.costumes._position.x);
            bounds.top += (newY - this.costumes._position.y);
            bounds.bottom += (newY - this.costumes._position.y);    
        }
        // Find how far we need to move the target position.
        let dx = 0;
        let dy = 0;
        let hosei = 0; // 補正用（現在補正はゼロ）
        if (bounds.left < fence.left) {
            dx += fence.left - bounds.left +hosei;
        }
        if (bounds.right > fence.right) {
            dx += fence.right - bounds.right -hosei;
        }
        if (bounds.top > fence.top) {
            dy += fence.top - bounds.top -hosei;
        }
        if (bounds.bottom < fence.bottom) {
            dy += fence.bottom - bounds.bottom +hosei;
        }
        return [newX + dx , newY + dy];
    }
    $isTouchingEdge (_callback){
        if(!this.$isAlive()) false;

        const judge = this.$_onEdgeBounds();
        if(judge  == null )  {
            if( this.touchingEdge === true) this.touchingEdge = false;
            return false;
        }
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == '') {
            if( this.touchingEdge === true) this.touchingEdge = false;
            return false;
        }
        if(this.touchingEdge === true) {
            return false; 
        }
        if(_callback) {
            const callback = _callback.bind(this);
            setTimeout(callback, 0);
        }

        return true;
    }
    $isTouchingVirticalEdge (){
        if(!this.$isAlive()) return false;

        const touch = this.$isTouchingEdge();
        if( touch === false) {
            return false;
        }        
        const judge = this.$$onEdgeBounds();
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == 'bottom' || nearestEdge == 'top') {
            return false;
        }
        return true;
    }

    $isTouchingHorizontalEdge (){
        if(!this.$isAlive()) return false;

        const touch = this.$isTouchingEdge();
        if( touch === false) {
            return false;
        }        
        const judge = this.$$onEdgeBounds();
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == 'right' || nearestEdge == 'left') {
            return false;
        }
        return true;
    }
    $gotoRandomPosition() {
        if(!this.$isAlive()) return;

        const p = Libs.default;
        const _x = (Math.random() - 0.5 ) * p.stageWidth;
        const _y = (Math.random() - 0.5 ) * p.stageHeight;
        this.$setXY( _x, _y);
    }

    $gotoMousePosition() {
        const position = Libs.default.mousePosition;
        this.$setXY(position.x, position.y);
    }
    $gotoSprite(sprite) {
        if(!this.$isAlive()) return;
        if( sprite instanceof Sprite ) {
            // const _x = sprite.$_position.x;
            // const _y = sprite.$_position.y;
            const _x = sprite.$_prev_position.x;
            const _y = sprite.$_prev_position.y;
            this.$setXY(_x, _y);
        }    
    }

    $glideToPosition(sec, x, y) {
        if(!this.$isAlive()) return;
        if(typeof sec != 'number') return;
        let _x = 0;
        let _y = 0;
        if(typeof x == 'number'){
            _x = x;
            _y = y;
        }else{
            const obj = x;
            _x = obj.x;
            _y = obj.y;
        }
        let _stopper = false;
        // おそらく、停止ボタンクリック時に
        // emit-->on でイベントを受け取り、_stopper = true にしたいのだろうと
        // 思われる。後で実装に組み込んでおく。
        //        const f = function(){ // これは使用されていない。
        //            _stopper = true;
        //        }
        const _glideX = _x;
        const _glideY = _y;
        return new Promise( async (resolve) => {
            const framesPerSecond = 1000 / Env.pace;
            const stepX = (_glideX - this.$_position.x) / (sec * framesPerSecond);
            const stepY = (_glideY - this.$_position.y) / (sec * framesPerSecond);
            let i = 0;
            const me = this;
            const interval = setInterval(() => {
            if(_stopper === true) {
                clearInterval(interval);
                resolve();
            }
            i += 1;
            me.$setForceXY( me.$_position.x + stepX, me.$_position.y + stepY  );
            if (i / framesPerSecond >= sec) {
                // 
                me.$setForceXY( _glideX, _glideY);
                clearInterval(interval);
                resolve();
            }
            },Env.pace);
        });
    }
    static get Global () {
        return 'global'
    }
    $pointToMouse ( _global = null ) {
        if(!this.$isAlive()) return;
        if( _global === Sprite.Global ){
            this.pointTowardsMouseCursolGlobal();
        }else{
            this.pointTowardsMouseCursol();
        }
    }

    $pointToTarget( target ) {
        if(!this.$isAlive()) return;

        let dx = target.$_position.x - this.$_position.x;
        let dy = target.$_position.y - this.$_position.y;

        let direction = 90 - MathUtils.radToDeg(Math.atan2(dy, dx));
        if(direction > 180) {
            direction -= 360;
        }
        this.$pointInDerection( direction );
    }

    $pointInDerection( _d ) {
        if(!this.$isAlive()) return;

        if(_d < 0) {
            let _direction = _d % 360;
            if( _direction < -180) {
                _direction = 360 + _direction;
            }
            this.$_direction = _direction;
        }else{
            // _derection 0 以上 
            let _direction = _d % 360;
            if( _direction > 180) {
                _direction = _direction - 360;
            }
            this.$_direction = _direction;
        }
    }
    $setRotationStyle( _style ) {
        if(!this.$isAlive()) return;
        if(this.costumes){
            this.costumes.setRotationStyle( _style );
        }
    }

    $nextCostume() {
        if(!this.$isAlive()) return;
        if(this.costumes){
            this.costumes.nextCostume();
        }
        //サイズが大きなコスチュームに切り替えた後
        //$_ifOnEdgeBounds()をすると位置と向きが変化
        //してしまう。
        //$_ifOnEdgeBounds()はその場しのぎで入れた記憶が
        //あるのではずしてみる。
        //this.$_ifOnEdgeBounds();
    }
    $switchCostume( val ) {
        if(!this.$isAlive()) return;
        if( val ){
            if( typeof val === 'string') {
                const _name = val;
                if(this.costumes)
                    this.costumes.switchCostumeByName(_name);
 
            }else if( Number.isInteger(val)) {
                const _idx = val;
                if(this.costumes)
                    this.costumes.switchCostumeByNumber(_idx);
            }    
        }
    }
    $nextBackDrop() {
        const stage = PlayGround.default.stage;
        stage.$nextBackDrop();
    }
    $switchBackDrop( backdrop ) {
        const stage = PlayGround.default.stage;
        stage.$switchBackDrop( backdrop );
    }

    $setVisible( _visible ) {
        if(!this.$isAlive()) return;
        this.updateVisible(_visible);
    }

    async loadSound(name,soundUrl, options={}) {
        this._loadSound(name, soundUrl, options);
    }
    async loadImage(name, imageUrl) {
        this._loadImage(name, imageUrl, this.costumes);
    }
    async $addSound(soundData) {
        if(arguments.length > 1){
            throw "Sound.add 引数が多い";
        }
        let _soundData;
        if(soundData == undefined ){
            throw "【Sprite.Sound.add】サウンドデータの指定がありません"
        }else if(soundData == undefined || typeof soundData == "string"){
            _soundData = PlayGround.default.loadedSounds[soundData];
            if(_soundData == undefined){
                throw "【Sprite.Sound.add】正しいサウンド名を指定してください"
            }
        }else{
            _soundData = soundData;
        }
        if(_soundData['name'] == undefined || _soundData['data'] == undefined ){
            throw "【Sprite.Sound.add】正しいサウンドデータを指定してください"
        }
        if(this.soundDatas){
            _soundData.options = {};
            this.soundDatas.push(_soundData);
            const name = _soundData.name;
            const data = _soundData.data;
            const promise = this._addSound(name, data, {});
            return promise;    
        }
    }
    async $addImage(imageData) {
        let _imageData;
        if(imageData == undefined){
            throw "【Sprite.Image.add】イメージデータの指定がありません"
        }else if(typeof imageData == "string"){
            _imageData = PlayGround.default.loadedImages[imageData];
            if(_imageData == undefined){
                throw "【Sprite.Image.add】正しいイメージ名を指定してください"
            }
        }else{
            _imageData = imageData;
        }
        if(_imageData['name'] == undefined || _imageData['data'] == undefined ){
            throw "【Sprite.Image.add】正しいイメージデータを指定してください"
        }
        if( this.imageDatas) {
            this.imageDatas.push(_imageData);
            const name = _imageData.name;
            const data = _imageData.data;
            await this._addImage(name, data, this.costumes);    
        }
        return this;
    }
    $getImageNames() {
        const iterator = this.costumes.costumes.keys();
        return iterator.toArray();
    }
    $say( text, properties = {} ) {
        if(!this.$isAlive()) return;
        if( text && (typeof text) == 'string') {
            this.bubble.say( text , properties );
            return;
        }
        // 空テキストのときは フキダシを消す。
        this.bubble.destroyBubble();
    }
    $sayForSecs( text, secs, properties={}) {
        if(!this.$isAlive()) return;
        this.$say(text, properties);
        const me = this;
        return new Promise(resolve => {
            this._bubbleTimeout = setTimeout(() => {
                // タイムアウトしたときに吹き出しを消す
                me.bubble.destroyBubble();
                me._bubbleTimeout = null;
                resolve();
            }, 1000 * secs);
        });
    }

    $think( text, properties = {} ) {
        if(!this.$isAlive()) return;
        if( text && (typeof text) == 'string') {
            this.bubble.think( text , properties );
            return;
        }

        this.bubble.destroyBubble();
    }
    $thinkForSecs( text, secs, properties={}) {
        if(!this.$isAlive()) return;
        this.$think(text, properties);
        return new Promise(resolve => {
            this._bubbleTimeout = setTimeout(() => {
                this._bubbleTimeout = null;
                this.bubble.destroyBubble();
                resolve();
            }, 1000 * secs);
        });
    }
    $_isDrawableExist(){
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if(drawable == null){
            return false;
        }
        return true;
    }
    $drawingDimensions() {
        return this.$getDrawingDimensions();
    }
    $getDrawingDimensions() {
        let width = 0;
        let height = 0  
        if(this.$_isDrawableExist()){
            const bounds = this.render.renderer.getBounds(this.drawableID);
            height = Math.abs(bounds.top - bounds.bottom);
            width = Math.abs(bounds.left - bounds.right);    
        }   
        return {width, height};
    }
    $getCurrentPosition() {
        const x = this.$_position.x;
        const y = this.$_position.y
        return {x:x, y:y};
    }
    $getCurrentDirection() {
        return this.$_direction;
    }

    $getCurrentSize() {
        return {w: this.$_scale.w, h: this.$_scale.h};
    }

    async $askAndWait(text) {
        const question = new QuestionBoxElement.default();
        const me = this;
        return new Promise(async resolve=>{
            const answer = await question.ask(me, text);
//            question.removeAsk(me);
            resolve(answer);
        });
    }

    get M(){
        return this.Motion;
    }
    get Position() {
        //console.log(this);
        const me = this;
        const position = {
            "x" : 0,
            "y" : 0,
        };
        Object.defineProperty(position, "x", {
            get : function() {
                const {x} = me.Motion.getCurrentPosition();
                return x;
            },
            set : function(x) {
                me.Motion.setX(x);
            }
        })
        Object.defineProperty(position, "y", {
            get : function() {
                const {y} = me.Motion.getCurrentPosition();
                return y;
            },
            set : function(y) {
                me.Motion.setY(y);
            }
        })

        return position;
    }
    get Direction() {
        const me = this;
        const direction = {"degree": 0};
        Object.defineProperty(direction, "degree", {
            get : function() {
                return me.$getCurrentDirection();
            },
            set : function(degree) {
                me.$pointInDerection(degree);
            }
        })

        return direction;
    }
    get Motion() {
        return {
            "Position" : this.Position,
            "Direction": this.Direction,
            "getCurrentPosition": this.$getCurrentPosition.bind(this),
            "getCurrentDirection": this.$getCurrentDirection.bind(this),
            "moveSteps" : this.$moveSteps.bind(this),
            "moveTo" : this.$moveTo.bind(this),
            "ifOnEdgeBounds" : this.$ifOnEdgeBounds.bind(this),
            "gotoRandomPosition": this.$gotoRandomPosition.bind(this),
            "gotoMousePosition" : this.$gotoMousePosition.bind(this),
            "gotoSprite" : this.$gotoSprite.bind(this),
            "glideToPosition": this.$glideToPosition.bind(this),
            /** マウスの位置へ向く */
            "pointToMouse" : this.$pointToMouse.bind(this),
            /** 指定したターゲットの位置へ向く */
            "pointToTarget" : this.$pointToTarget.bind(this),
            /** 角度を指定して向きを変える */
            "pointInDerection" : this.$pointInDerection.bind(this),
            /** 回転方法を指定する */
            "setRotationStyle" : this.$setRotationStyle.bind(this),
            //--- Entity
            "gotoXY": this.$goToXY.bind(this),
            "pointInDirection": this.$setDirection.bind(this),
            "turnRightDegrees": this.$turnRight.bind(this),
            "turnLeftDegrees" : this.$turnLeft.bind(this),
            "setXY" : this.$setXY.bind(this),
            "setX" : this.$setX.bind(this),
            "setY" : this.$setY.bind(this),
            "changeX" : this.$changeX.bind(this),
            "changeY" : this.$changeY.bind(this),

        };
    }
    get L() {
        return this.Looks;
    }
    get Costume() {
        const me = this;
        const costume = {"no": 0, "name": ""};
        Object.defineProperty(costume, "no", {
            get : function() {
                return me.costumes.currentSkinNo();
            },
        })
        Object.defineProperty(costume, "name", {
            get : function() {
                return me.costumes.currentSkinName();
            },
        })

        return costume;
    }
    get Backdrop(){
        const stage = PlayGround.default.stage;
        const backdrop = {"no": 0, "name": ""};
        Object.defineProperty(backdrop, "no", {
            get : function() {
                return stage.backdrops.currentSkinNo();
            },
        })
        Object.defineProperty(backdrop, "name", {
            get : function() {
                return stage.backdrops.currentSkinName();
            },
        })
        return backdrop;

    }
    get Size(){
        const me = this;
        const size = {
            w: 0, h: 0, scale: 0,
        }
        Object.defineProperty(size, "w", {
            get : function() {
                const {w} = me.$getCurrentSize();
                return w;
            },
            set : function(w) {
                const {h} = me.$getCurrentSize();
                me.$setScale(w, h);
            }
        })
        Object.defineProperty(size, "h", {
            get : function() {
                const {h} = me.$getCurrentSize();
                return h;
            },
            set : function(h) {
                const {w} = me.$getCurrentSize();
                me.$setScale(w, h);
            }
        })
        Object.defineProperty(size, "scale", {
            get : function() {
                const {w, h} = me.$getCurrentSize();
                return {w:w,h:h};
            },
            set : function(scale) {
                if(scale && scale.w != undefined && scale.h != undefined){
                    me.$setScale(scale.w, scale.h);
                }
            }
        })

        return size;
    }
    get Looks(){
        return {
            "Costume" : this.Costume,
            "Backdrop" : this.Backdrop,
            "nextCostume": this.$nextCostume.bind(this),
            "switchCostume": this.$switchCostume.bind(this),
            "nextBackdrop": this.$nextBackDrop.bind(this),       // Sprite-->Stageへ
            "switchBackdrop": this.$switchBackDrop.bind(this),   // Sprite-->Stageへ
            "say": this.$say.bind(this),
            "sayForSecs": this.$sayForSecs.bind(this),
            "think": this.$think.bind(this),
            "thinkForSecs": this.$thinkForSecs.bind(this),
            "changeSizeBy" : this.$changeSizeBy.bind(this),
            "Size": this.Size,
            "getSize" : this.$getCurrentSize.bind(this),
            "setSize" : this.$setScale.bind(this),
            "changeEffectBy": this.$changeEffectBy.bind(this),
            "setEffect": this.$setEffectTo.bind(this),
            "clearEffects": this.$clearEffect.bind(this),
            "show": this.$show.bind(this),
            "hide": this.$hide.bind(this),
            "goToFront": this.$goToFront.bind(this),
            "goToBack": this.$goToBack.bind(this),
            "goForwardLayers": this.$goForwardLayers.bind(this),
            "goBackwardLayers": this.$goBackwardLayers.bind(this),
            "drawingDimensions":this.$drawingDimensions.bind(this),
            

        };
    }
    get C() {
        return this.Control;
    }
    get Control() {
        return {
            "wait" : this.$waitSeconds.bind(this),
            "waitUntil": this.$waitUntil.bind(this),
            "waitWhile": this.$waitWhile.bind(this),
            "cloneAndWait": this.$cloneAndWait.bind(this),
            "clone": this.$clone.bind(this),
            "whenCloned": this.$whenCloned.bind(this),
            //---- Entity
            "forever": this.forever.bind(this),
            "while": this.while.bind(this),
            "repeat": this.repeat.bind(this),
            "repeatUntil": this.repeatUntil.bind(this),
            "stopAll" : this.$stopAll.bind(this),
            "remove"  : this.$remove.bind(this),
            "alive"   : this.$isAlive.bind(this),
            "stopThisScript" : this.$stopThisScript.bind(this),
            "stopOtherScripts" : this.$stopOtherScripts.bind(this),

        };
    }
    get Distance(){
        const me = this;
        const distanceToOthers = function(otherSprite) {
            if(otherSprite && (otherSprite['isSprite'] && otherSprite.isSprite() === true )){
                const obj1 = {
                    x: me.Motion.Position.x,
                    y: me.Motion.Position.y,
                }
                const obj2 = {
                    x: otherSprite.Motion.Position.x,
                    y: otherSprite.Motion.Position.y,
                }
                const _distance = Utils.distance(obj1, obj2);
                return _distance;
            }
            return -1;
        }
        const distance = {
            "mousePointer": 0,
            "to": distanceToOthers,
        };
        Object.defineProperty(distance, "mousePointer", {
            get : function() {
                const obj1 = {
                    x: me.Motion.Position.x,
                    y: me.Motion.Position.y,
                }
                const obj2 = {
                    x: me.Sensing.Mouse.x,
                    y: me.Sensing.Mouse.y,
                }
                const _distance = Utils.distance(obj1, obj2);
                return _distance;
            },
        })
        return distance;

    }
    get Sensing() {
        return {
            "askAndWait": this.$askAndWait.bind(this),
            "isKeyDown" : this.$isKeyDown.bind(this),
            "isKeyNotDown" : this.$isKeyNotDown.bind(this),
            "isMouseDown" : this.$isMouseDown.bind(this),
            "Mouse" : this.Mouse,
            "Distance": this.Distance,
            "timer" : this.$timer,
            "resetTimer": this.$resetTimer.bind(this),

            "isTouchingEdge" : this.$isTouchingEdge.bind(this),
            "isTouchingVirticalEdge" : this.$isTouchingVirticalEdge.bind(this),
            "isTouchingHorizontalEdge" : this.$isTouchingHorizontalEdge.bind(this),
            "isNotMouseTouching" : this.$isNotMouseTouching.bind(this),
            "isMouseTouching": this.$isMouseTouching.bind(this),
            "isTouchingToSprite": this.$isTouchingTargetToTarget.bind(this),
            "getTouchingSprites": this.$getTouchingTarget.bind(this),
            "isTouchingToColor" : this.$isTouchingColor.bind(this),
            "colorIsTouchingToColor" : this.$colorIsTouchingColor.bind(this),
        }
    }
    get E() {
        return this.Event;
    }
    get Event() {
        return {
            "broadcast" : this.$broadcast.bind(this),
            "broadcastAndWait" : this.$broadcastAndWait.bind(this),
            "broadcastToTargets": this.$broadcastToTargets.bind(this),
            "broadcastAndWaitToTargets": this.$broadcastAndWaitToTargets.bind(this),
            "whenBroadcastReceived": this.$whenBroadcastReceived.bind(this),
            "whenRightNow": this.$whenRightNow.bind(this),
            "whenFlag": this.$whenFlag.bind(this),
            "whenKeyPressed": this.$whenKeyPressed.bind(this),
//            "whenMouseTouched": this.$whenMouseTouched.bind(this),
//            "whenTargetMouseTouched": this.$whenTouchingTarget.bind(this),
            "whenClicked": this.$whenClicked.bind(this),
            /** 背景が〇〇に変わったとき */
            "whenBackdropSwitches": this.$whenBackdropSwitches.bind(this),



        }
    }
    get Image (){
        return {
            "add": this.$addImage.bind(this),
            "names" : this.$getImageNames.bind(this),
        }
    }
    get Sound() {
        return {
            "add": this.$addSound.bind(this),
            "switch" : this.$soundSwitch.bind(this),
            "next" : this.$nextSound.bind(this),
            "play" : this.$soundPlay.bind(this),
            "playUntilDone": this.$startSoundUntilDone.bind(this),
            "setOption" : this.$setOption.bind(this),
            "changeOptionValue" : this.$changeOptionValue.bind(this),
            "clearEffects" : this.$clearSoundEffect.bind(this),
            "stop": this.$soundStop.bind(this),
            "stopImmediately": this.$soundStopImmediately.bind(this),

        }
    }
    get Extensions() {
        return {
            //---Entity
            "speech": this.$speech.bind(this),
            "speechAndWait" : this.$speechAndWait.bind(this),
            "speechStopAll": this.$speechStopImmediately.bind(this),

        }
    }


};
module.exports = Sprite;