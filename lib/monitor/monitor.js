const Entity = require('../entity');
const Libs = require('../libs');
const PlayGround = require('../playGround');
const StageLayering = require('../stageLayering');
const Utils = require('../utils');
const Monitor = class extends Entity {
    constructor(monitorId, label){
        super(monitorId, StageLayering.MONITOR_LAYER);
        this._monitorId = monitorId;
        this._label = label;        
        this._visible = true;
        this._skin = null;
        this.render = PlayGround.default.render;
        this._position = {x: 0, y: 0};
        this._scale = {w: 100, h: 100};
    }
    get monitorId() {
        return this._monitorId;
    }
    get position() {
        return this._position;
    }
    set position(_position){
        if( _position != undefined && _position.x != undefined && _position.y != undefined ) {
            if(Utils.isNumber(_position.x) && Utils.isNumber(_position.y)){                
                this._position.x = _position.x;
                this._position.y = _position.y;
            }
        }
    }
    get scale() {
        return this._scale;
    }
    set scale(_scale){
        if( _scale != undefined && _scale.w != undefined && _scale.h != undefined ) {
            if(Utils.isNumber(_scale.w) && Utils.isNumber(_scale.h)){
                this._scale.w = _scale.w;
                this._scale.h = _scale.h;    
            }
        }
    }
    show () {
        this._visible = true;
        if(this._skin != null){
            this._skin.show();
        }
    }
    hide () {
        this._visible = false;
        if(this._skin != null){
            this._skin.hide();
        }
    }
    createTextSkin(){
        
        const skinId = this.render.renderer.s3CreateMonitorSkin(this.drawableID, this._label);
        this._skinId = skinId;
        this._skin = this.render.renderer.getS3Skin(skinId);
    }
    get value () {
        return this._skin.value;
    }
    set value( _value ){
        this._skin.value = _value;
    }
    get skin () {
        return this._skin;
    }
    set skin( _skin ){
        this._skin = _skin;
    }
    getDefaultHeight(){
        return this._skin.getDefaultHeight();
    }
    getDrawingDimension(){
        let width = 0;
        let height = 0
        const drawable = this.render.renderer._allDrawables[this.drawableID];
        if(drawable != null) {
            const bounds = this.render.renderer.getBounds(this.drawableID);
            height = Math.abs(bounds.top - bounds.bottom);
            width = Math.abs(bounds.left - bounds.right);
        }
        return {w:width, h:height};
    }
    update() {
        const properties = {
            skindId: this._skinId,
            position: [this._position.x, this._position.y],
            scale: [ this._scale.w, this._scale.h ],
            visible : this._visible,
        }
        this.render.renderer.updateDrawableProperties( this.drawableID, properties );
        this.render.renderer.updateDrawableSkinId(this.drawableID, this._skinId);
    }
}

module.exports = Monitor;