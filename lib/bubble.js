const Process = require('./process');
const StageLayering = require('./stageLayering');
const uid = require('./uid');
const Bubble = class {

    constructor( sprite ) {
        this._initBubbleState();
        this.sprite = sprite;
        this.process = Process.default;
        this.renderer = this.process.render.renderer;
        this._scale = {x:100, y:100};
    }
    _initBubbleState() {
        this.bubbleState = {};
        this.bubbleState.drawableID = null;
        this.bubbleState.skinId = null;
        this.bubbleState.text = "";
        this.bubbleState.type = "say";
        this.bubbleState.onSpriteRight = true;
        this.bubbleState.uid = null; // <--- 使用用途不明
    }
    isBubbleActive() {
        if( this.bubbleState.uid == null) {
            return false;
        }
        return true;
    }

    set direction( _direction ) {
        this._direction = _direction;
    }
    setScale( x, y ) {
        if( x == 0 || y == 0 ) {
            // ゼロスケールではDrawできないので回避する。
            return;
        }
        // マイナススケールのとき 文字が反転（鏡文字）となるのでそれを回避する。
        let _x = Math.abs(x);
        let _y = Math.abs(y);
        this.scaleX = _x;
        this.scaleY = _y;    
}
    async createDrawable() {
        if(this.bubbleState.drawableID == null ) {
            const bubbleDrawableID = this.renderer.createDrawable( StageLayering.SPRITE_LAYER );
            this.bubbleState.drawableID = bubbleDrawableID;
        }
    }

    async createTextSkin() {
        if(this.bubbleState.skinId == null ) {
            this.bubbleState.skinId = this.renderer.createTextSkin(
                this.bubbleState.type, 
                this.bubbleState.text, 
                this.bubbleState.onSpriteRight
            );
            this.bubbleState.uid = uid();    
        }
    }
    async say( _text, _properties = {}) {
        this.bubbleState.type = 'say';
        this.bubbleState.text = _text;
        await this._renderBubble(_properties);
    }
    async think(_text,  _properties = {}) {
        this.bubbleState.type = 'think';
        this.bubbleState.text = _text;
        await this._renderBubble(_properties);
    }
    updateScale( x, y ) { 
        if(this.bubbleState.drawableID != null){
            if( x == 0 || y == 0 ) {
                // ゼロスケールではDrawできないので回避する。
                return;
            }
            // マイナススケールのとき 文字が反転（鏡文字）となるのでそれを回避する。
            let _x = Math.abs(x);
            let _y = Math.abs(y);
            this._scale.x = _x;
            this._scale.y = _y;
            this.renderer.updateDrawableScale ( this.bubbleState.drawableID , [_x, _y] );        
    }
    }
    async _renderBubble(_properties={}) {
        if(this.sprite.visible == false || this.bubbleState.text === '') {
            if( this.bubbleState.uid != null ) {
                this.destroyBubble();
            }
            return;
        }
        if( this.bubbleState.uid == null ) {
            this.createDrawable();
            await this.createTextSkin();    
            if( Object.keys(_properties).length > 0 ) {
                if( 'scale' in _properties ) {
                    this.updateScale( _properties.scale.x, _properties.scale.y );
                }
            }
            this.renderer.updateDrawableSkinId(this.bubbleState.drawableID, this.bubbleState.skinId);
        }else if(this.bubbleState.skinId) {
            if( Object.keys(_properties).length > 0 ) {
                if( 'scale' in _properties ) {
                    this.updateScale( _properties.scale.x, _properties.scale.y );
                }
            }
            this.renderer.updateTextSkin(this.bubbleState.skinId, this.bubbleState.type, this.bubbleState.text, this.bubbleState.onSpriteRight);
        }
        this._positionBubble();
        return;
    }
    moveWithSprite() {
        this._positionBubble();
    }
    _positionBubble() {
        if(this.bubbleState.skinId) {
            try{
                const [_bubbleWidth, _bubbleHeight] = this.renderer.getCurrentSkinSize( this.bubbleState.drawableID );
                const bubbleWidth = _bubbleWidth * this._scale.x / 100; 
                const bubbleHeight = _bubbleHeight * this._scale.y / 100;
                const targetBounds = this.renderer.getBoundsForBubble( this.sprite.drawableID );
                const stageSize = this.renderer.getNativeSize();
                const stageBounds = {
                    left: -stageSize[0] / 2,
                    right: stageSize[0] / 2,
                    top: stageSize[1] / 2,
                    bottom: -stageSize[1] / 2
                };
                if( this.bubbleState.onSpriteRight === true 
                    && bubbleWidth + targetBounds.right > stageBounds.right && (targetBounds.left - bubbleWidth > stageBounds.left) ) {
                    if( this._scale.x > 0) {
                        this.bubbleState.onSpriteRight = false;
                    } else {
                        this.bubbleState.onSpriteRight = false;
                    }
                    this.renderer.updateTextSkin(this.bubbleState.skinId, this.bubbleState.type, this.bubbleState.text, this.bubbleState.onSpriteRight);
                } else if( this.bubbleState.onSpriteRight === false 
                    && targetBounds.left - bubbleWidth < stageBounds.left && (bubbleWidth + targetBounds.right < stageBounds.right) ) {
                    if( this._scale.x > 0) {
                        this.bubbleState.onSpriteRight = true;
                    } else {
                        this.bubbleState.onSpriteRight = false;
                    }
                    this.renderer.updateTextSkin(this.bubbleState.skinId, this.bubbleState.type, this.bubbleState.text, this.bubbleState.onSpriteRight);
                } else {
                    const positionX = (this.bubbleState.onSpriteRight)? 
                        (Math.max(stageBounds.left,Math.min(stageBounds.right - bubbleWidth, targetBounds.right)))
                        :(Math.min(stageBounds.right - bubbleWidth, Math.max(stageBounds.left, targetBounds.left - bubbleWidth )));
                    const positionY = Math.min(stageBounds.top, targetBounds.bottom + bubbleHeight);
                    this.renderer.updateDrawablePosition(this.bubbleState.drawableID, [positionX, positionY]);
                }
        
            } catch(e) {
                //console.log(e);
            }
        }
    }
    destroyBubble() {
       if(this.isBubbleActive()) {
            this.renderer.destroyDrawable( this.bubbleState.drawableID, StageLayering.SPRITE_LAYER);
            this.renderer.destroySkin( this.bubbleState.skinId )
            this._initBubbleState();    
        }
    }
}

module.exports = Bubble;