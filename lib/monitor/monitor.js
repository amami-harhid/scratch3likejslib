const Entity = require('../entity');
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
        this.renderer = this.render.renderer;
        this._position = {x: 0, y: 0};
        this._scale = {w: 100, h: 100};
        this._dropEnabled = true;
        this._moveDistance = null;
        const me = this;
        const runtime = PlayGround.default.runtime;
        runtime.on(Monitor.Events.DROP_START, (senderDrawableID)=>{
            if( me.drawableID === senderDrawableID) {
                // DROP開始したモニターは階層最上位にする
                me.renderer.setDrawableOrder(me.drawableID, Infinity, 
                    StageLayering.MONITOR_LAYER, true);
                // マウスが触った場所と左上隅の距離（位置関係）を記録する。モニターDROP時に利用する
                me._moveDistance = {
                    x: me.$mouseX - me._position.x,
                    y: me.$mouseY - me._position.y,
                };
                me._skin.dropping = true;
            }else{
                me._dropEnabled = false;
                me._moveDistance = null;
                me._skin.dropping = false;
            }
        });
        runtime.on(Monitor.Events.DROP_COMPLETE, ()=>{
            me._dropEnabled = true;
            me._moveDistance = null;
            me._skin.dropping = false;
        });
        this._preDraw = true;
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
                if(this._preDraw === true){
                    this._render()
                }
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
                if(this._preDraw === true){
                    this._render()
                }
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
        const skinId = this.renderer.s3CreateMonitorSkin(this.drawableID, this._label);
        this._skinId = skinId;
        this._skin = this.renderer.getS3Skin(skinId);
    }
    /**
     * 文字列型
     */    
    get text () {
        return this._skin.value;
    }
    /**
     * 文字列型
     */    
    set text( _text ){
        // 文字列化して格納
        this._skin.value = ''+_text;
    }
    /**
     * 数値型
     */    
    get value () {
        return this._skin.value;
    }
    /**
     * 数値型
     */    
    set value( _value ){
        if(Utils.isNumber(_value)){
            this._skin.value = _value;
        }else{
            throw `与えたパラメータ(${_value})が数値ではありません`;
        }
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
        const drawable = this.renderer._allDrawables[this.drawableID];
        if(drawable != null) {
            const bounds = this.renderer.getBounds(this.drawableID);
            height = Math.abs(bounds.top - bounds.bottom);
            width = Math.abs(bounds.left - bounds.right);
        }
        return {w:width, h:height};
    }
    draw() {
        this._preDraw = false;
        if(this._dropEnabled){
            this._drop();
        }
        this._render();
    }
    _render() {
        if(this.drawableID != null && this.renderer != null && this._skinId != null) {
            const properties = {
                skindId: this._skinId,
                position: [this._position.x, this._position.y],
                scale: [ this._scale.w, this._scale.h ],
                visible : this._visible,
            }
            this.renderer.updateDrawableProperties( this.drawableID, properties );
            this.renderer.updateDrawableSkinId(this.drawableID, this._skinId);    
        }
    }
    _drop() {
        const runtime = PlayGround.default.runtime;
        if( this._moveDistance == null) {
            if(this.$isMouseTouching() && this.$isMouseDown()){
                runtime.emit(Monitor.Events.DROP_START, this.drawableID);
            }
        }else{
            if(this.$isMouseDown()){
                this._position.x = this.$mouseX - this._moveDistance.x;
                this._position.y = this.$mouseY - this._moveDistance.y;
            }else{
                runtime.emit(Monitor.Events.DROP_COMPLETE);
                this._moveDistance = null;
            }
        }
    }
}
Monitor.Events = {
    DROP_START: 'DropStart',
    DROP_COMPLETE: 'DropComplete'
} 

module.exports = Monitor;