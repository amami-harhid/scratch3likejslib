//const Backdrops = require('./backdrops');
//const Canvas = require('./canvas');
const Env = require('./env');
const Entity = require('./entity');
const libs = require('./libs');
const PlayGround = require('./playGround');
const QuestionBoxElement = require('./io/questionBoxElement');
const StageLayering = require('./stageLayering');
const Stage = class extends Entity {
    constructor( options={} ) {
        if(typeof options == "string") throw "new Stage() パラメータはオブジェクト型のみ"
        super( "stage", StageLayering.BACKGROUND_LAYER, options );
        this.effect = {
            color : ('effect' in options)? (('color' in options.effect)? options.effect.color : 0) : 0,
            mosaic : ('effect' in options)? (('mosaic' in options.effect)? options.effect.mosaic : 0) : 0,
            fisheye : ('effect' in options)? (('fisheye' in options.effect)? options.effect.fisheye : 0) : 0,
        };
        this.$_position =  ('position' in options)? {x: options.position.x, y: options.position.y} : {x:0, y:0};
        this.direction = ('direction' in options)? options.direction : 90;
        this.scale = ('scale' in options)? {x: options.scale.x, y: options.scale.y} : {x:100, y:100};

        this.keysCode = [];
        this.keysKey = [];
        this.backdrops = new libs.default.Backdrops();
        this._sprites = [];
        this.skinIdx = -1;
        this.mouse = {scratchX:0, scratchY:0, x:0, y:0, down: false, pageX: 0, pageY: 0, clientX: 0, clientY: 0 };
        const me = this;
        // これは Canvasをつくる Element クラスで実行したほうがよさそう（関連性強いため）
        const p = PlayGround.default;
        const canvas = p.canvas;
        const body = document.getElementById('main');
        body.addEventListener('mousemove', (e) => {
            me.mouse.pageX = e.pageX;
            me.mouse.pageY = e.pageY;
            e.stopPropagation()
        });
        canvas.addEventListener('mousemove', (e) => {
            me.mouse.x = e.offsetX;
            me.mouse.y = e.offsetY;

            me.mouse.clientX = e.clientX;
            me.mouse.clientY = e.clientY;
            
            me.mouse.scratchX = e.offsetX - p.canvas.width/2;
            me.mouse.scratchY = p.canvas.height/2 - e.offsetY;

//            e.stopPropagation()
        }, {});
        canvas.addEventListener('mousedown', (e) => {
            me.mouse.x = e.offsetX;
            me.mouse.y = e.offsetY;
            me.mouse.down = true;
            e.stopPropagation();
        })
        canvas.addEventListener('mouseup', (e) => {
            me.mouse.x = e.offsetX;
            me.mouse.y = e.offsetY;
            me.mouse.down = false;
            e.stopPropagation();
        })
  
        PlayGround.default.stage = this;
    }
    isSprite() {
        return false;
    }
    get sprites () {
        return this._sprites;
    }
    addSprite (sprite) {
        const curSprite = sprite;
        this._sprites.push( curSprite );
        curSprite.z = this._sprites.length
        this._sortSprites();
    }
    _sortSprites() {
        const n0_sprites = this._sprites;
        const n1_sprites = n0_sprites.sort( function( a, b ) {
            if (a.z > b.z) return -1;
            if (b.z > a.z) return +1;
            return 0;
        });
//        let _z = -1;
        let _z = n1_sprites.length-1;
        const n2_sprites = n1_sprites.map(s=>{
//            s.z = ++_z;
            s.z = --_z;
            return s;
        });
        this._sprites = n2_sprites;

    }
    removeSprite ( sprite ) {
        const curSprite = sprite;
        const n_sprites = this._sprites.filter( ( item ) => item !== curSprite );
        this._sprites = n_sprites;
        this._sortSprites();
    }
    update() {
        super.update();
        this.backdrops.setPosition(this.$_position.x, this.$_position.y);
        this.backdrops.setScale(this.scale.x, this.scale.y);
        this.backdrops.setDirection(this.direction);
        this.backdrops.update(this.drawableID);
        for(const _sprite of this._sprites){
            _sprite.update();
        }        
    }
    draw() {
        this.render.renderer.draw();
    }
    sendSpriteBackwards (sprite) {
        // 工事中
    
    }
    sendSpriteForward (sprite) {
        // 工事中
    }
    sendSpriteToFront (sprite) {
        // 工事中
    }
    sendSpriteToBack (sprite) {
        // 工事中
    }
    isKeyPressed (userKey) {
        let match = false
        let check
    
        typeof userKey === 'string' ? check = userKey.toLowerCase() : check = userKey
        this.keysKey.indexOf(check) !== -1 ? match = true : null
        this.keysCode.indexOf(check) !== -1 ? match = true : null
    
        return match
    }
    move(x,y) {
        this.$_position.x = x;
        this.$_position.y = y;
        this.backdrops.setPosition(this.$_position.x, this.$_position.y);
    }
    async loadSound(name,soundUrl, options={}) {
        await this._loadSound(name, soundUrl, options);
    }
    async loadImage(name, imageUrl) {
        this._loadImage(name, imageUrl, this.backdrops);
    }
    async $addSound(soundData) {
        if(arguments.length > 1){
            throw "Sound.add 引数が多い";
        }
        let _soundData;
        if(soundData == undefined){
            throw "【Stage.Sound.add】サウンドデータの指定がありません"
        }else if(soundData == undefined || typeof soundData == "string"){
            _soundData = PlayGround.default.loadedSounds[soundData];
            if(_soundData == undefined){
                throw "【Stage.Sound.add】正しいサウンド名を指定してください"
            }
        }else{
            _soundData = soundData;
        }

        if(_soundData['name'] == undefined || _soundData['data'] == undefined ){
            throw "【Stage.Sound.add】正しいサウンドデータを指定してください"
        }
        const name = _soundData.name;
        const data = _soundData.data;
        const promise = this._addSound(name, data, {})
        return promise;
    }
    async $addImage(imageData) {
        if(arguments.length > 1){
            throw "Image.add 引数が多い";
        }
        let _imageData;
        if(imageData == undefined){
            throw "【Stage.Image.add】イメージデータの指定がありません"
        }else if(typeof imageData == "string"){
            _imageData = PlayGround.default.loadedImages[imageData];
            if(_imageData == undefined){
                throw "【Stage.Image.add】正しいイメージ名を指定してください"
            }
        }else{
            _imageData = imageData;
        }        
        if(_imageData['name'] == undefined || _imageData['data'] == undefined ){
            throw "【Stage.Image.add】正しいイメージデータを指定してください"
        }
        const name = _imageData.name;
        const data = _imageData.data;
        await this._addImage(name, data, this.backdrops);

    }
    $getImageNames() {
        const iterator = this.backdrops.costumes.keys();
        return iterator.toArray();
    }
    $emitWhenBackdropChange(backdropName, newBackdropName) {
        // 新しい名前の背景に切り替わったとき
        if(backdropName !== newBackdropName){
            this.$broadCastBackdropSwitch(newBackdropName);
        }
    }
    $nextBackDrop() {
        if(!this.isAlive()) return;
        if(this.backdrops){
            const name_before = this.backdrops.currentSkinName();
            this.backdrops.nextCostume();
            const name_after = this.backdrops.currentSkinName();
            this.$emitWhenBackdropChange(name_before, name_after);
        }
        //this.ifOnEdgeBounds();
    }
    $switchBackDrop( val ) {
        if(!this.isAlive()) return;
        if( val ){
            if( typeof val === 'string') {
                const _name = val;
                if(this.backdrops) {
                    const name_before = this.backdrops.currentSkinName();
                    this.backdrops.switchCostumeByName(_name);
                    const name_after = this.backdrops.currentSkinName();
                    this.$emitWhenBackdropChange(name_before, name_after);
                }
            }else if( Number.isInteger(val)) {
                const _idx = val;
                if(this.backdrops){
                    const name_before = this.backdrops.currentSkinName();
                    this.backdrops.switchCostumeByNumber(_idx);
                    const name_after = this.backdrops.currentSkinName();
                    this.$emitWhenBackdropChange(name_before, name_after);
                }
            }    
        }
    }
    remove() {
        for(const _s of this.sprites){
            _s.remove();
        }

        try{
            this.render.renderer.destroyDrawable(this.drawableID, StageLayering.SPRITE_LAYER);

        }catch(e){
            
        }finally{
        }
        
        this.backdrops.destroyAllSkin();
        PlayGround.default.stage = null;
        this.$delete();
    }

    async $askAndWait(text) {
        const question = new QuestionBoxElement.default();
        const me = this;
        return new Promise(async resolve=>{
            const answer = await question.ask(me, text);
            resolve(answer);
        });
    }
    get Backdrop(){
        const stage = this;
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

    get L() {
        return this.Looks;
    }
    get Looks(){
        return {
            "Backdrop" : this.Backdrop,
            "nextBackdrop": this.$nextBackDrop.bind(this),       // Sprite-->Stageへ
            "switchBackdrop": this.$switchBackDrop.bind(this),   // Sprite-->Stageへ
            "changeEffectBy": this.$changeEffectBy.bind(this),  // Sprite-->Entityへ
            "setEffectTo": this.$setEffectTo.bind(this),        // Sprite-->Entityへ
            "clearEffects": this.$clearEffect.bind(this),       // Sprite-->Entityへ

        };
    }
    get C() {
        return this.Control;
    }
    get Control() {
        return {
            "wait" : this.$waitSeconds.bind(this),    // Sprite --> Entityへ
            "waitUntil": this.$waitUntil.bind(this),  // Sprite --> Entityへ
            "waitWhile": this.$waitWhile.bind(this),  // Sprite --> Entityへ
            //---- Entity
            "forever": this.forever.bind(this),
            "while": this.while.bind(this),
            "repeat": this.repeat.bind(this),
            "repeatUntil": this.repeatUntil.bind(this),
            "stopAll" : this.$stopAll.bind(this),
            "stopThisScript" : this.$stopThisScript.bind(this),
            "stopOtherScripts" : this.$stopOtherScripts.bind(this),
        };
    }
    get Sensing() {
        return {
            "askAndWait": this.$askAndWait.bind(this),
            "isKeyDown" : this.$isKeyDown.bind(this),
            "isKeyNotDown" : this.$isKeyNotDown.bind(this),
            "isMouseDown" : this.$isMouseDown.bind(this),
            "Mouse" : this.Mouse,
            "timer" : this.$timer,
            "resetTimer": this.$resetTimer.bind(this),
            "getBackDrop" : null, // Spriteで工事中
//            "isNotMouseTouching" : this.isNotMouseTouching.bind(this),
//            "isMouseTouching": this.isMouseTouching.bind(this),
//            "isTouchingTargetToTarget": this.isTouchingTargetToTarget.bind(this),
//            "getTouchingTarget": this.getTouchingTarget.bind(this),
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
            //"whenMouseTouched": this.$whenMouseTouched.bind(this),
            //"whenTargetMouseTouched": this.$whenTouchingTarget.bind(this),
            "whenCloned": this.$whenCloned.bind(this),
            "whenClicked": this.$whenClicked.bind(this),
            "whenBackdropSwitches": this.$whenBackdropSwitches.bind(this),



        }
    }
    get Image() {
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
};

module.exports = Stage;