//const Costumes = require('../costumes');
//const Entity = require('../entity');
const PlayGround = require('../playGround');
//const StageLayering = require('../stageLayering');
//const S3MonitorImage = require('./s3MonitorImage');
const S3MonitorSkin = require('./s3MonitorSkin');
const Monitor = class {
    constructor(id, label){
        //super(name, StageLayering.SPRITE_LAYER);
        this._id = id;
        this._label = label;
        this._visible = true;
        this.skin = null;
        this.render = PlayGround.default.render;
        this._x = 0;
        this._y = 0;
        //this.costumes = new Costumes();
        //this.costumes.addImage('image', S3MonitorImage.MONITOR_IMAGE);
        //this.createTextSkin();
    }
    get id() {
        return this._id;
    }
    show () {
        this._visible = true;
        if(this.skin != null){
            this.skin.show();
        }
    }
    hide () {
        this._visible = false;
        if(this.skin != null){
            this.skin.hide();
        }
    }
    createTextSkin(x, y){
        //const newSkinId = this.render.renderer._allSkins.length+1;
        console.log('createTextSkin');
        const skin = new S3MonitorSkin(this._id, this.render.renderer, this._label);
        //skin.setTextMonitor(text);
        this.skin = skin;
        this.skin.x = x;
        this.skin.y = y;
    }
    get text () {
        return this.skin.text;
    }
    set text( _text ){
        this.textRender(_text);
    }
    textRender(text, size = [100,100]) {
        this.skin.text = text;
        this.skin.getTexture(size);
    }
    getDefaultHeight(){
        return this.skin.getDefaultHeight();
    }
}

module.exports = Monitor;