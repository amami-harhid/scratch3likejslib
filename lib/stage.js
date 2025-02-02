const Backdrops = require('./backdrops');
const Canvas = require('./canvas');
const Env = require('./env');
const Entity = require('./entity');
const Process = require('./process');
const StageLayering = require('./stageLayering');
const Stage = class extends Entity {
    constructor( name='stage', options={} ) {
        super( name, StageLayering.BACKGROUND_LAYER, options );    
        this.effect = {
            color : ('effect' in options)? (('color' in options.effect)? options.effect.color : 0) : 0,
            mosaic : ('effect' in options)? (('mosaic' in options.effect)? options.effect.mosaic : 0) : 0,
            fisheye : ('effect' in options)? (('fisheye' in options.effect)? options.effect.fisheye : 0) : 0,
        };
        this.position =  ('position' in options)? {x: options.position.x, y: options.position.y} : {x:0, y:0};
        this.direction = ('direction' in options)? options.direction : 90;
        this.scale = ('scale' in options)? {x: options.scale.x, y: options.scale.y} : {x:100, y:100};

        this.keysCode = [];
        this.keysKey = [];
        this.backdrops = new Backdrops();
        this._sprites = [];
        this.skinIdx = -1;
        this.mouse = {scratchX:0, scratchY:0, x:0, y:0, down: false, pageX: 0, pageY: 0, clientX: 0, clientY: 0 };
        const me = this;
        // これは Canvasをつくる Element クラスで実行したほうがよさそう（関連性強いため）
        const p = Process.default;
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
            
            me.mouse.scratchX = e.offsetX - P.canvas.width/2;
            me.mouse.scratchY = P.canvas.height/2 - e.offsetY;

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
  
        Process.default.stage = this;
    }
    get sprites () {
        return this._sprites;
    }
    addSprite (sprite) {
        //const p = Process.default;
        const curSprite = sprite;
        this._sprites.push( curSprite );
        curSprite.z = this._sprites.length
        this._sortSprites();
    }
    _sortSprites() {
        const n0_sprites = this._sprites;
        const n1_sprites = n0_sprites.sort( function( a, b ) {
            if (a.z > b.z) return -1;
            if (b.z > a.z) return  1;
            return 0;
        });
        let _z = -1;
        n1_sprites.map(s=>{
            s.z = ++_z;
        });
        this._sprites = n1_sprites;

    }
    removeSprite ( sprite ) {
        const p = Process.default;
        const curSprite = sprite;
        const n_sprites = this._sprites.filter( ( item ) => item !== curSprite );
        this._sprites = n_sprites;
        this._sortSprites();
    }
    update() {
        super.update();
        this.backdrops.setPosition(this.position.x, this.position.y);
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
        this.position.x = x;
        this.position.y = y;
        this.backdrops.setPosition(this.position.x, this.position.y);
    }
    async loadSound(name,soundUrl, options={}) {
        await this._loadSound(name, soundUrl, options);
    }
    async loadImage(name, imageUrl) {
        this._loadImage(name, imageUrl, this.backdrops);
    }
    async addSound(soundData, options={}) {
        const name = soundData.name;
        const data = soundData.data;
        await this._addSound(name, data, options)
    }
    async addImage(imageData) {
        const name = imageData.name;
        const data = imageData.data;
        await this._addImage(name, data, this.backdrops);

    }

};

module.exports = Stage;