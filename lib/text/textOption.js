const DefaultFontName = 'sans-serif';
const DefaultFontSize = 50;
const DefaultFillStyle = 'black';
const DefaultShadowColor = 'black';
const TextOption = class  {
    constructor( ) {
        this._fontName = null;
        this._fontSize = null;
        this._fillStyle = null;
        this._shadowColor = null;
        this._shadowOffsetX = null;
        this._shadowOffsetY = null;
        this._shadowBlur = null;

    }
    setCtxFontOption( ctx, fontRate = 1 ) {
        if( this._fontName && this._fontSize ) {
            ctx.font = `${this._fontSize * fontRate}px ${this._fontName}`;
        }else{
            ctx.font = `${DefaultFontSize * fontRate}px ${DefaultFontName}`;
        }
        ctx.fillStyle = this._fillStyle || DefaultFillStyle;
        if(this._shadowColor) {
            ctx.shadowColor = this._shadowColor;
        }
        if( this._shadowOffsetX ) {
            ctx.shadowOffsetX = this._shadowOffsetX;
        }else{
            ctx.shadowOffsetX = 0;
        }
        if( this._shadowOffsetY ) {
            ctx.shadowOffsetY = this._shadowOffsetY;
        }else{
            ctx.shadowOffsetY = 0;
        }
        if( this._shadowBlur ) {
            ctx.shadowBlur = this._shadowBlur;
        }else{
            ctx.shadowBlur = 0;
        }
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize( fontSize ) {
        this._fontSize = fontSize;
    }

    get fontName() {
        return this._fontName;
    }
    set fontName( fontName ) {
        this._fontName = fontName;
    }

    get fillStyle() {
        return this._fillStyle
    }
    set fillStyle( fillStyle ) {
        this._fillStyle = fillStyle
    }

    get shadowColor() {
        return this._shadowColor;
    }
    set shadowColor( shadowColor ) {
        this._shadowColor = shadowColor;
    }

    get shadowOffsetX() {
        return this._shadowOffsetX;
    }
    set shadowOffsetX(shadowOffsetX) {
        this._shadowOffsetX = shadowOffsetX;
    }

    get shadowOffsetY() {
        return this._shadowOffsetY;
    }
    set shadowOffsetY( shadowOffsetY ) {
        this._shadowOffsetY = shadowOffsetY;
    }

    get shadowBlur() {
        return this._shadowBlur;
    }
    set shadowBlur( shadowBlur ) {
        this._shadowBlur = shadowBlur;
    }

};

module.exports = TextOption;