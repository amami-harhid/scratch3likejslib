const Bubble = require('./bubble');
const Entity = require('./entity');
const Env = require('./env');
const Costumes = require('./costumes');
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const Process = require('./process');
const StageLayering = require('./stageLayering');
const Utils = require('./utils');
const Sprite = class extends Entity {

    constructor(name, options = {}) {
        super(name, StageLayering.SPRITE_LAYER, options);
        const stage = Process.default.stage;
        this.stage = stage;
        this.bubble = new Bubble(this);
        this.costumes = new Costumes();
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

    async clone(options = {}) {
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
                'position' : {x: this.position.x, y:this.position.y}, 
                'scale' : this.scale,
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
            const _visible = 
            newSprite.setVisible( false );
            this.clones.push(newSprite);
            newSprite.isClone = true;
            for(const d of this.imageDatas) {
                // svg image の場合、createSVGSkin の中で非同期になることに注意すること
                await newSprite.addImage(d); 
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
                await newSprite.addSound(_soundData, _options); // options引き継ぐ
            }
            newSprite.update(); // update() は不要かもしれない。
            newSprite.originalSprite = this;

            // 注意： Scratch3 風に Sprite duplicate をしてみたい。（調べる）
            // whenClone
            // ここで emit 
            // target( = EventEmitter ) を作る。target は renderer を操作するメソッドを持つ。
            // rendererを操作する処理は emit で行う。
            const runtime = Process.default.runtime;
            const eventId = `whenClone_${this.name}`;
            runtime.emit(eventId, newSprite);
            return newSprite;
        }
    }
    _costumeProperties(target) {
        target.costumes.setPosition(target.position.x, target.position.y);
        target.costumes.setScale(target.scale.x, target.scale.y);
        target.costumes.setDirection(target.direction);
        target.costumes.update(target.drawableID, this._effect);

    }
    update() {
        super.update();
        this._costumeProperties(this);
        if(Env.bubbleScaleLinkedToSprite === true) {
            this.bubble.updateScale(this.scale.x, this.scale.y);
        }
        this.bubble.moveWithSprite();
    }
    moveSteps(steps) {
        const radians = MathUtils.degToRad(90 - this.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        this.setXY( this.position.x + dx, this.position.y + dy );
    
    }
    setScale(x, y) {
        super.setScale(x,y);
        this.bubble.setScale(x, y);
    }

    goToXY( x, y) {
        if ( !Utils.isNumber(x)) {
            return;
        }
        if ( !Utils.isNumber(y)) {
            return;
        }
        this.setXY( x, y );

    }
    moveTo( x, y ) {
        this.goToXY( x, y);       
    }
    onEdgeBounds() {
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
    _ifOnEdgeBounds() {
        const judge = this.onEdgeBounds();
        if(judge &&  judge.minDist && judge.minDist == Infinity) return null;
        return judge;
    }
    ifOnEdgeBounds() {
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
        this.direction = newDirection;
        // Keep within the stage.
        this.keepInFence(this.costumes._position.x, this.costumes._position.y);
        /* 
        for(;;) {
            this.keepInFence(this.costumes._position.x, this.costumes._position.y);
            const touch = this.isTouchingEdge();
            if( touch === false ) break;
            await Utils.wait(0);
        }
        */

    }
    keepInFence(x, y) {
        const fencedPosition = this._keepInFence(x, y);
        if(fencedPosition){
            //console.log(fencedPosition);
            this.position.x = fencedPosition[0];
            this.position.y = fencedPosition[1];
            this.costumes._position.x = fencedPosition[0];
            this.costumes._position.y = fencedPosition[1];
            // ifOnEdgeBounds の後で isTouchingEdge　が false になる。
            // この動作は Scratch3の動きと異なるので NG
            // 次の２行をしているからだと思うのでコメントアウトしてみる。--> コメントアウトで期待した効果が出た。
            // オリジナルScratch3でも ifOnEdgeBounds の後で isTouchingEdge　が false になることがあるのでまあよしとする。
            // Scratch3オリジナル、斜めに端に触れるときに この事象が起きやすい。
            //this.moveSteps(1);
            //this.update();
        }
    }
    _keepInFence(newX,newY){
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if( drawable == null || drawable.skin == null) return;
        const bounds = this.render.renderer.getBounds(this.drawableID);
        if(!bounds) return;
        const stageWidth = this.render.stageWidth;
        const stageHeight = this.render.stageHeight;
        // fence を bounds で調整する
        const distLeft = Math.max(0, (stageWidth / 2) + bounds.left);
        const distTop = Math.max(0, (stageHeight / 2) - bounds.top);
        const distRight = Math.max(0, (stageWidth / 2) - bounds.right);
        const distBottom = Math.max(0, (stageHeight / 2) + bounds.bottom);
        const fence = {
            left: -(stageWidth / 2),
            top: stageHeight / 2,
            right: stageWidth / 2,
            bottom: -(stageHeight / 2),
        };
        // Adjust the known bounds to the target position.
        bounds.left += (newX - this.costumes._position.x);
        bounds.right += (newX - this.costumes._position.x);
        bounds.top += (newY - this.costumes._position.y);
        bounds.bottom += (newY - this.costumes._position.y);
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
    isTouchingEdge (_callback){
        const judge = this.onEdgeBounds();
        if(judge  == null )  {
            if( this.touchingEdge === true) this.touchingEdge = false;
            return false;
        }
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == '') {
            if( this.touchingEdge === true) this.touchingEdge = false;
            return false;
        }
        if(this.touchingEdge === true) return false; 

        if(_callback) {
            const callback = _callback.bind(this);
            setTimeout(callback, 0);
        }

        return true;
    }
    isTouchingVirticalEdge (){
        const touch = this.isTouchingEdge();
        if( touch === false) {
            return false;
        }        
        const judge = this.onEdgeBounds();
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == 'bottom' || nearestEdge == 'top') {
            return false;
        }
        return true;
    }

    isTouchingHorizontalEdge (){
        const touch = this.isTouchingEdge();
        if( touch === false) {
            return false;
        }        
        const judge = this.onEdgeBounds();
        const nearestEdge = judge.nearestEdge;
        if(nearestEdge == 'right' || nearestEdge == 'left') {
            return false;
        }
        return true;
    }
/* 
    turnRight( _degree ) {
        let _d = this.direction;
        _d += _degree;
        this.direction = _calcDegree(_d % 360);
    }

    turnLeft( _degree ) {
        let _d = this.direction;
        _d -= _degree;
        this.direction = _calcDegree(_d % 360);
    }
    _calcDegree(_degree) {
        const _d = _degree % 360;
        if( _d > 0) {
            if( _d > 180) {
                _d = _d - 360;
            }
            return _d;
        }else if( _d < 0) {
            if( _d < -180) {
                _d = _d + 360;
            }
            return _d;
        }
        return _d;
    }
*/

    gotoRandomPosition() {
        const process = Process.default;
        const _x = (Math.random() - 0.5 ) * process.stageWidth;
        const _y = (Math.random() - 0.5 ) * process.stageHeight;
        this.setXY( _x, _y);
    }

    gotoMousePosition() {
        // 工事中
    }

    foundSpriteByName(name){
        // 工事中

    }
    gotoSprite(sprite) {
        if( sprite instanceof Sprite ) {
            const _x = sprite.position.x;
            const _y = sprite.position.y;
            this.setXY(_x, _y);
        }    
    }

    glideToPosition(sec, x, y) {
        let _stopper = false;
        const f = function(){
            _stopper = true;
        }
        const process = Process.default;
        const runtime = process.runtime;
        runtime.once(Sprite.EmitIdMovePromise, f);
        return new Promise( async (resolve) => {
            const framesPerSecond = 1000 / Env.pace;
            const stepX = (x - this.position.x) / (sec * framesPerSecond);
            const stepY = (y - this.position.y) / (sec * framesPerSecond);
            let i = 0;
            const me = this;
            const interval = setInterval(() => {
                if(_stopper === true) {
                    clearInterval(interval);
                    resolve();
                }
                i += 1;
                me.setXY( me.position.x + stepX, me.position.y + stepY  );
                if (i / framesPerSecond >= sec) {
                    me.setXY( x, y );
                    runtime.removeListener(Sprite.EmitIdMovePromise, f);
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
        if( _global === Sprite.Global ){
            this.pointTowardsMouseCursolGlobal();
        }else{
            this.pointTowardsMouseCursol();
        }
    }

    pointToTarget( target ) {

        let dx = target.position.x - this.position.x;
        let dy = target.position.y - this.position.y;

        let direction = 90 - MathUtils.radToDeg(Math.atan2(dy, dx));
        if(direction > 180) {
            direction -= 360;
        }
        this.pointInDerection( direction );
    }

    pointInDerection( _d ) {

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
        this.costumes.setRotationStyle( _style );
    }

    nextCostume() {
        this.costumes.nextCostume();
        this.ifOnEdgeBounds();
    }
    switchCostume( val ) {
        if( val ){
            if( typeof val === 'string') {
                const _name = val;
                this.costumes.switchCostumeByName(_name);
 
            }else if( Number.isInteger(val)) {
                const _idx = val;
                this.costumes.switchCostumeByNumber(_idx);
            }    
        }
    }
    setVisible( _visible ) {
        this.updateVisible(_visible);
    }

    async loadSound(name,soundUrl, options={}) {
        this._loadSound(name, soundUrl, options);
    }
    async loadImage(name, imageUrl) {
        this._loadImage(name, imageUrl, this.costumes);
    }
    async addSound(soundData, options = {}) {
        const _soundData = soundData;
        _soundData.options = options;
        this.soundDatas.push(_soundData);
        const name = _soundData.name;
        const data = _soundData.data;
        await this._addSound(name, data, options);
    }
    async addImage(imageData) {
        this.imageDatas.push(imageData);
        const name = imageData.name;
        const data = imageData.data;
        await this._addImage(name, data, this.costumes);
    }

    say( text, secs, properties = {} ) {
        if( text && (typeof text) == 'string') {
            this.bubble.say( text , properties );
            return;
        }
        // 空テキストのときは フキダシを消す。
        this.bubble.destroyBubble();
    }
    sayForSecs( text, secs, properties={}) {
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
        if( text && (typeof text) == 'string') {
            this.bubble.think( text , properties );
            return;
        }

        this.bubble.destroyBubble();
    }
    thinkForSecs( text, secs, properties={}) {
        this.think(text, properties);
        return new Promise(resolve => {
            this._bubbleTimeout = setTimeout(() => {
                this._bubbleTimeout = null;
                this.bubble.destroyBubble();
                resolve();
            }, 1000 * secs);
        });
    }

};
module.exports = Sprite;