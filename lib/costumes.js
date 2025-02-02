const RotationStyle = require('./rotationStyle');
const Env = require('./env');
const ImageLoader = require('./importer/imageLoader');
const MathUtil = require('./util/math-util');
const Process = require('./process');
const Utils = require('./utils');
const Costumes = class {
    static get RotationStyle () {
        return RotationStyle;
    }
    constructor() {
        this.render = Process.default.render;
        this.skinId = null;
        this.costumes = new Map();
        this._position = {x:0, y:0};
        this._direction = 90;
        this._scale = {x:100, y:100};
        this._rotationStyle = RotationStyle.ALL_AROUND;
        this._rotationStylePatterns = [RotationStyle.LEFT_RIGHT, RotationStyle.DONT_ROTATE, RotationStyle.ALL_AROUND];
   }
   async addImage(name, image) {
        await this._setSkin(name, image);
        await P.Utils.wait(Env.pace);
    }
    async loadImage(name, image) {
        const _img = await ImageLoader.loadImage(image);
        this.addImage(name,_img);
    }
    async _setSkin(name,_img) {
        if(ImageLoader.isSVG(_img)) {
            // 複数回ロードしたら、その都度 skinId は変わる
            const _svgText = _img;
            this._setSvgSkin(_svgText).then(v=>{
                const _skinId = v;
                this.costumes.set( name , _skinId);
                if( this.skinId == null) {
                    this.skinId = _skinId; // 初回のSkinId 
                }    
            });
        }else{
            const _bitmap = _img;
            const _skinId = await this._setBitmapSkin(_bitmap);        
            this.costumes.set( name , _skinId);
            if( this.skinId == null) {
                this.skinId = _skinId; // 初回のSkinId 
            }
        }
    }
    async _setSvgSkin(_svgText) {
        const skinId = this.render.renderer.createSVGSkin(_svgText);
        return skinId;
    }
    async _setBitmapSkin(_bitmap) {
        const skinId = await this.render.renderer.createBitmapSkin(_bitmap);
        return skinId;        
    }
    setRotationStyle ( _style ) {
        if( this._rotationStylePatterns.includes( _style ) ) {
            this._rotationStyle = _style;
        }
    }
    setDirection( direction) {
        const _direction = MathUtil.wrapClamp( direction, -179, 180);
        if ( this._rotationStyle == RotationStyle.LEFT_RIGHT ) {
            if( _direction < 0 || _direction > 180) {
                // left 
                this._direction = 90;
                this._scale.x = - Math.abs(this._scale.x);
            } else {
                // right
                this._direction = 90;
                this._scale.x = Math.abs(this._scale.x);
            }
            return;
        } 
        if ( this._rotationStyle == RotationStyle.ALL_AROUND ) {
            this._direction = _direction;
            return;
        } 
        return;
    }
    setPosition(x, y) {
        this._position.x = x;
        this._position.y = y;
    }
    setScale(x,y) {
        this._scale.x = x;
        this._scale.y = y;
    }
    switchCostumeByName(name) {
        if( this.costumes.has(name)) {
            this.skinId = this.costumes.get(name);
        }
        // do nothing
    }
    switchCostumeByNumber(idx) {
        if(Utils.isInteger(idx)) {
            const _keys = this.costumes.keys;
            if( 0 > idx  || idx == _keys.length || idx > _keys.length ) {
                // do nothing
            }else{
                const _name =  _keys[idx];       
                this.skinId = this.costumes.get(_name);
            }    
        }
        // do nothing
    }
    destroyAllSkin() {
        const costumesKeys = Array.from(this.costumes.keys());
        for(const name of costumesKeys) {
            const skinId = this.costumes.get(name);
            this.render.renderer.destroySkin(skinId);
        }
        this.costumes = []
    }
    currentSkinName() {
        const costumesKeys = Array.from(this.costumes.keys());
        if(costumesKeys.length == 0) {
            return null;
        }
        if(this.skinId == null) {
            const name = costumesKeys[0];
            return name;
        }
        for(const _name of costumesKeys) {
            const _skinId = this.costumes.get(_name);
            if(_skinId == this.skinId) {
                return _name;
            }
        }
        return null;
    }
    nextCostume() {
        const costumesKeys = Array.from(this.costumes.keys());
        if(costumesKeys.length == 0) {
            return; // do nothing
        }
        if(this.skinId == null) {
            const name = costumesKeys[0];
            const _skinId = this.costumes.get(name);
            this.skinId == _skinId;
            return;
        }
        // search next skinId
        let _idx = 0;
        for(const _name of costumesKeys) {
            const _skinId = this.costumes.get(_name);
            if(_skinId == this.skinId) {
                if( _idx == (costumesKeys.length - 1) ){
                    const nextName = costumesKeys[0];
                    this.skinId = this.costumes.get(nextName);
                }else{
                    const nextName = costumesKeys[_idx+1];
                    this.skinId = this.costumes.get(nextName);
                }
                return;
            }
            _idx += 1;
        }
        // do nothing

    }

    update( drawableID, effect = {} ) {
        const _skinId = this.skinId;
        if( this.isSvgSkin( _skinId ) ) {
            if( !this.isSvgComplete( _skinId )) {
                return;
            }     
        }
        const properties = {};
        const skinObj = { skinId: _skinId };
        const directionObj = { direction: this._direction };
        const scaleObj = { scale: [ this._scale.x, this._scale.y ] };
        const positionObj = { position: [this._position.x, this._position.y] };
        Object.assign( properties, skinObj, directionObj, scaleObj, positionObj, effect );
        this.render.renderer.updateDrawableProperties( drawableID, properties );

    }
    isSvgSkin( skinId ) {
        if( this.render.renderer._allSkins.includes( skinId ) ) {
            const _skin = this.render.renderer._allSkins[ skinId ];
            if( _skin.constructor.name == 'SVGSkin' ) {
                return true;
            }
        }
        return false;
    }
    isSvgComplete( skinId ) {
        if( this.render.renderer._allSkins.includes( skinId ) ) {
            const _skin = this.render.renderer._allSkins[ skinId ];
            if( _skin.constructor.name == 'SVGSkin' ) {
                const _svgImage = _skin._svgImage;
                if( _svgImage.complete ) {
                    return true;
                }
            }
        }
        return false;
    }
};

module.exports = Costumes;