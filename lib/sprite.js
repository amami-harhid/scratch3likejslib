const Bubble = require('./bubble');
const Entity = require('./entity');
const Env = require('./env');
const Libs = require('./libs');
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const PlayGround = require('./playGround');
const StageLayering = require('./stageLayering');
const Utils = require('./utils');
const Sprite = class extends Entity {

    constructor(name, options = {}) {        
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
        this._ifOnEdgeBoundsFlag = false;
        this._ifOnEdgeBoundsPosition = {x:0, y:0};
        this._ifOnEdgeBoundsDirection = 0;

    }
    delete () {
        super.delete();
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
    remove() {
        if(this._isAlive === false) return;
        if(this.isClone === true) {
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

        this.delete();
    }

    isAlive() {
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
    async $clone(options = {}) {
        if(this.isClone == undefined){
            const newName = `${this.name}_${this.clones.length+1}`;
            // クローン時にエフェクトを引き継ぐ。
            // クローン別にエフェクトを設定したいときは
            // clone() 実行後に 個別に設定すること。
            const COLOR = Looks.COLOR;
            const FISHEYE = Looks.FISHEYE;
            const WHIRL = Looks.WHIRL;
            const PIXELATE = Looks.PIXELATE;
            const MOSAIC = Looks.MOSAIC;
            const BRIGHTNESS = Looks.BRIGHTNESS;
            const GHOST = Looks.GHOST;
            const _options = {
                'position' : {x: this.$_position.x, y:this.$_position.y}, 
                'scale' : this.$_scale,
                'direction' : (this.direction)? this.direction: 90,
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
            //console.log(newSprite.render)
            // デフォでは本体の前に表示されるので、1つ背面へ移動する
            newSprite.goBackwardLayers(1)
            const _visible = 
            newSprite.setVisible( false );
            this.clones.push(newSprite);
            newSprite.isClone = true;
            for(const d of this.imageDatas) {
                // svg image の場合、createSVGSkin の中で非同期になることに注意すること
                await newSprite.$addImage(d); 
            }
            let _name = this.costumes.currentSkinName();
            if( _name != null ){
                newSprite.costumes.switchCostumeByName(_name);
            }
            for(const d of this.soundDatas) {
                const _soundData = {};
                _soundData.name = d.name;
                _soundData.data = d.data;
                const _options = d.options;
                await newSprite.$addSound(_soundData, _options); // options引き継ぐ
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
            target.costumes.setScale(target.$_scale.x, target.$_scale.y);
            target.costumes.setDirection(target.direction);
            target.costumes.update(target.drawableID, this._effect);    
        }

    }
    _goLayers(nLayers){
        if (this.render.renderer) {
            this.render.renderer.setDrawableOrder(this.drawableID, nLayers, StageLayering.SPRITE_LAYER, true);
        }
    }
    goToFront() {
        this._goLayers(Infinity); // 最上位
    }
    goToBack() {
        this._goLayers(-Infinity); // 最下位
    }
    goForwardLayers (nLayers) {
        this._goLayers(nLayers);
    }
    goBackwardLayers (nLayers) {
        this._goLayers(-nLayers);
    }
    update() {
        super.update();
        if(this._ifOnEdgeBoundsFlag){
            this.direction = this._ifOnEdgeBoundsDirection;
            this.$_position.x = this._ifOnEdgeBoundsPosition.x;
            this.$_position.y = this._ifOnEdgeBoundsPosition.y;
            if(this.costumes){
                this.costumes._position.x = this._ifOnEdgeBoundsPosition.x;
                this.costumes._position.y = this._ifOnEdgeBoundsPosition.y;    
            }
            this._ifOnEdgeBoundsFlag = false;
        }
        this._costumeProperties(this);
        // スプライトを消すとき bubbleを参照できない
        if(this.bubble){
            if(Env.bubbleScaleLinkedToSprite === true) {
                this.bubble.updateScale(this.$_scale.x, this.$_scale.y);
            }
            this.bubble.moveWithSprite();    
        }
    }
    $moveSteps(steps) {
        const radians = MathUtils.degToRad(90 - this.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        this.$setXY( this.$_position.x + dx, this.$_position.y + dy );
    
    }
    $setScale(x, y) {
        if(Utils.isNumber(x)){
            super.$setScale(x,y);
            this.bubble.setScale(x, y);
        }else{
            const obj = x;
            super.$setScale(obj.x,obj.y);
            this.bubble.setScale(obj.x, obj.y);
        }
    }

    $goToXY( x, y) {
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
        this.$goToXY( x, y);       
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
        this._ifOnEdgeBoundsFlag = false;
        if(!this.isAlive()) return;
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
        this._ifOnEdgeBoundsFlag = true;// 端にふれている。
        // Point away from the nearest edge.
        const radians = MathUtils.degToRad(90 - this.direction);
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
        this._ifOnEdgeBoundsDirection = newDirection;
        // 向きを変えたことが即反映されているのかな？
        //this.direction = newDirection;
        //this.update();
        // Keep within the stage.
        if(this.costumes ) {
            this.$_keepInFence(this.costumes._position.x, this.costumes._position.y);
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
    $_keepInFence(x, y) {
        if(!this.isAlive()) return;
        const fencedPosition = this.$_keepInFencePosition(x, y);
        if(fencedPosition){
            //console.log(fencedPosition);
            this._ifOnEdgeBoundsPosition.x = fencedPosition[0];
            this._ifOnEdgeBoundsPosition.y = fencedPosition[1];
//            this.position.x = fencedPosition[0];
//            this.position.y = fencedPosition[1];
//            this.costumes._position.x = fencedPosition[0];
//            this.costumes._position.y = fencedPosition[1];
            // ifOnEdgeBounds の後で isTouchingEdge　が false になる。
            // この動作は Scratch3の動きと異なるので NG
            // 次の２行をしているからだと思うのでコメントアウトしてみる。--> コメントアウトで期待した効果が出た。
            // オリジナルScratch3でも ifOnEdgeBounds の後で isTouchingEdge　が false になることがあるのでまあよしとする。
            // Scratch3オリジナル、斜めに端に触れるときに この事象が起きやすい。
            //this.moveSteps(1);
            //this.update();
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
        if (bounds.left < fence.left) {
            dx += fence.left - bounds.left;
        }
        if (bounds.right > fence.right) {
            dx += fence.right - bounds.right;
        }
        if (bounds.top > fence.top) {
            dy += fence.top - bounds.top;
        }
        if (bounds.bottom < fence.bottom) {
            dy += fence.bottom - bounds.bottom;
        }
        return [newX + dx, newY + dy];
    }
    $isTouchingEdge (_callback){
        if(!this.isAlive()) false;

        const judge = this.$_onEdgeBounds();
        if(judge  == null )  {
            if( this.touchingEdge === true) this.touchingEdge = false;
            //console.log('isTouchingEdge 01')
            return false;
        }
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == '') {
            if( this.touchingEdge === true) this.touchingEdge = false;
            //console.log('isTouchingEdge 02')
            return false;
        }
        if(this.touchingEdge === true) {
            //console.log('isTouchingEdge 03')
            return false; 
        }
        if(_callback) {
            const callback = _callback.bind(this);
            setTimeout(callback, 0);
        }
        //console.log('isTouchingEdge 04')

        return true;
    }
    isTouchingVirticalEdge (){
        if(!this.isAlive()) return false;

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

    isTouchingHorizontalEdge (){
        if(!this.isAlive()) return false;

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
    gotoRandomPosition() {
        if(!this.isAlive()) return;

        const p = PlayGround.default;
        const _x = (Math.random() - 0.5 ) * p.stageWidth;
        const _y = (Math.random() - 0.5 ) * p.stageHeight;
        this.$setXY( _x, _y);
    }

    gotoMousePosition() {
        // 工事中
    }
    gotoSprite(sprite) {
        if(!this.isAlive()) return;
        if( sprite instanceof Sprite ) {
            const _x = sprite.$_position.x;
            const _y = sprite.$_position.y;
            this.$setXY(_x, _y);
        }    
    }

    glideToPosition(sec, x, y) {
        if(!this.isAlive()) return;
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
            me.$setXY( me.$_position.x + stepX, me.$_position.y + stepY  );
            if (i / framesPerSecond >= sec) {
                me.$setXY( _glideX, _glideY);
                clearInterval(interval);
                resolve();
            }
            },Env.pace);
        });
    }
    static get Global () {
        return 'global'
    }
    pointToMouse ( _global = null ) {
        if(!this.isAlive()) return;
        if( _global === Sprite.Global ){
            this.pointTowardsMouseCursolGlobal();
        }else{
            this.pointTowardsMouseCursol();
        }
    }

    pointToTarget( target ) {
        if(!this.isAlive()) return;

        let dx = target.$_position.x - this.$_position.x;
        let dy = target.$_position.y - this.$_position.y;

        let direction = 90 - MathUtils.radToDeg(Math.atan2(dy, dx));
        if(direction > 180) {
            direction -= 360;
        }
        this.pointInDerection( direction );
    }

    pointInDerection( _d ) {
        if(!this.isAlive()) return;

        if(_d < 0) {
            let _direction = _d % 360;
            if( _direction < -180) {
                _direction = 180 + _direction;
            }
            this.direction = _direction;
        }else{
            // _derection 0 以上 
            let _direction = _d % 360;
            if( _direction > 180) {
                _direction = 180 - _direction;
            }
            this.direction = _direction;
        }
    }
    setRotationStyle( _style ) {
        if(!this.isAlive()) return;
        if(this.costumes){
            this.costumes.setRotationStyle( _style );
        }
    }

    nextCostume() {
        if(!this.isAlive()) return;
        if(this.costumes){
            this.costumes.nextCostume();
        }
        this.$_ifOnEdgeBounds();
    }
    switchCostume( val ) {
        if(!this.isAlive()) return;
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
    setVisible( _visible ) {
        if(!this.isAlive()) return;
        this.updateVisible(_visible);
    }

    async loadSound(name,soundUrl, options={}) {
        this._loadSound(name, soundUrl, options);
    }
    async loadImage(name, imageUrl) {
        this._loadImage(name, imageUrl, this.costumes);
    }
    async $addSound(soundData, options = {}) {
        const _soundData = soundData;
        _soundData.options = options;
        this.soundDatas.push(_soundData);
        const name = _soundData.name;
        const data = _soundData.data;
        await this._addSound(name, data, options);
    }
    async $addImage(imageData) {
        this.imageDatas.push(imageData);
        const name = imageData.name;
        const data = imageData.data;
        await this._addImage(name, data, this.costumes);
    }

    say( text, secs, properties = {} ) {
        if(!this.isAlive()) return;
        if( text && (typeof text) == 'string') {
            this.bubble.say( text , properties );
            return;
        }
        // 空テキストのときは フキダシを消す。
        this.bubble.destroyBubble();
    }
    sayForSecs( text, secs, properties={}) {
        if(!this.isAlive()) return;
        this.say(text, properties);
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

    think( text, properties = {} ) {
        if(!this.isAlive()) return;
        if( text && (typeof text) == 'string') {
            this.bubble.think( text , properties );
            return;
        }

        this.bubble.destroyBubble();
    }
    thinkForSecs( text, secs, properties={}) {
        if(!this.isAlive()) return;
        this.think(text, properties);
        return new Promise(resolve => {
            this._bubbleTimeout = setTimeout(() => {
                this._bubbleTimeout = null;
                this.bubble.destroyBubble();
                resolve();
            }, 1000 * secs);
        });
    }

    get M(){
        return this.Motion;
    }
    get Motion() {
        return {
            "moveSteps" : this.$moveSteps.bind(this),
            "moveTo" : this.$moveTo.bind(this),
            "ifOnEdgeBounds" : this.$ifOnEdgeBounds.bind(this),
            "gotoRandomPosition": this.gotoRandomPosition.bind(this),
            "gotoMousePosition" : this.gotoMousePosition.bind(this),
            "gotoSprite" : this.gotoSprite.bind(this),
            "glideToPosition": this.glideToPosition.bind(this),
            /** マウスの位置へ向く */
            "pointToMouse" : this.pointToMouse.bind(this),
            /** 指定したターゲットの位置へ向く */
            "pointToTarget" : this.pointToTarget.bind(this),
            /** 角度を指定して向きを変える */
            "pointInDerection" : this.pointInDerection.bind(this),
            /** 回転方法を指定する */
            "setRotationStyle" : this.setRotationStyle.bind(this),
            //--- Entity
            "gotoXY": this.$goToXY.bind(this),
            "pointInDirection": this.setDirection.bind(this),
            "turnRightDegrees": this.turnRight.bind(this),
            "turnLeftDegrees" : this.turnLeft.bind(this),
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
    get Looks(){
        return {
            "nextCostume": this.nextCostume.bind(this),
            "switchCostume": this.switchCostume.bind(this),
            "say": this.say.bind(this),
            "sayForSecs": this.sayForSecs.bind(this),
            "think": this.think.bind(this),
            "thinkForSecs": this.thinkForSecs.bind(this),
            "changeSizeBy" : this.changeSizeBy.bind(this),
            "setSize" : this.$setScale.bind(this),
            "changeEffectBy": this.changeEffectBy.bind(this),
            "setEffect": this.$setEffectTo.bind(this),
            "clearEffects": this.$clearEffect.bind(this),
            "show": this.show.bind(this),
            "hide": this.hide.bind(this),
            "goToFront": this.goToFront.bind(this),
            "goToBack": this.goToBack.bind(this),
            "goForwardLayers": this.goForwardLayers.bind(this),
            "goBackwardLayers": this.goBackwardLayers.bind(this),

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
            "clone": this.$clone.bind(this),
            "whenCloned": this.$whenCloned.bind(this),
            //---- Entity
            "forever": this.forever.bind(this),
            "while": this.while.bind(this),
            "repeat": this.repeat.bind(this),
            "repeatUntil": this.repeatUntil.bind(this),
            "stopAll" : null, // 工事中
        };
    }
    get Sensing() {
        return {
            "askAndWait": null, // Entityで 工事中
            "ksKeyDown" : null, // Libs.keyIsDown を呼び出すようにEntity工事中。
            "isMouseDown" : null, // Entityで工事中
            "mouseX" : null, // Entityで工事中
            "mouseY" : null, // Entityで工事中
            "timer" : null,  // Entityで工事中
            "resetTimer": null, // Entityで工事中

            "isTouchingEdge" : this.$isTouchingEdge.bind(this),
            "isTouchingVirticalEdge" : this.isTouchingVirticalEdge.bind(this),
            "isTouchingHorizontalEdge" : this.isTouchingHorizontalEdge.bind(this),
            "isNotMouseTouching" : this.$isNotMouseTouching.bind(this),
            "isMouseTouching": this.$isMouseTouching.bind(this),
            "isTouchingTargetToTarget": this.$isTouchingTargetToTarget.bind(this),
            "getTouchingTarget": this.getTouchingTarget.bind(this),
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
            "whenKeyPressed": null, // Entity 工事中
            "whenMouseTouched": this.$whenMouseTouched.bind(this),
            "whenTargetMouseTouched": this.$whenTouchingTarget.bind(this),
            "whenClicked": this.$whenClicked.bind(this),
            /** 背景が〇〇に変わったとき */
            "whenBackdropSwitchsTo": null, // Entityで工事中



        }
    }
    get Image (){
        return {
            "add": this.$addImage.bind(this),
        }
    }
    get Sound() {
        return {
            "add": this.$addSound.bind(this),
            //---Entity
            "switch" : this.soundSwitch.bind(this),
            "next" : this.nextSound.bind(this),
            "play" : this.soundPlay.bind(this),
            "playUntilDone": this.startSoundUntilDone.bind(this),
            "setVolume" : this.setSoundVolume.bind(this),
            "setPitch" : this.setSoundPitch.bind(this),
            "stop": this.soundStop.bind(this),
            "stopImmediately": this.soundStopImmediately.bind(this),

        }
    }
    get Extensions() {
        return {
            //---Entity
            "speech": this.$speech.bind(this),
            "speechAndWait" : this.$speechAndWait.bind(this),

        }
    }


};
module.exports = Sprite;