const Canvas = require('../canvas');
//const Env = require('../env');
//const Entity = require('./entity');
const PlayGround = require('../playGround');
const StageLayering = require('../stageLayering');
const Text = require('./text');
const TextOption = require('./textOption');
const Utils = require('../utils');

const TextDraw = class  {
    constructor( ) {
        Canvas.createTextCanvas( );
        this.textCanvas = Canvas.textCanvas
        this.ctx = this.textCanvas.getContext('2d', { willReadFrequently: true });
    }
    clear() {
        const width = this.textCanvas.width;
        const height = this.textCanvas.height;
        this.ctx.clearRect( 0, 0, width, height)

    }
    drawText( text , x, y) {

    }
    textDraw( text, x, y, textOption) {
        const p = PlayGround.default;
        let _textOption = textOption;
        if( _textOption == undefined) {
            _textOption = new TextOption();
        }
        const _fontRate = (p.renderRate.x > p.renderRate.y )? p.renderRate.x : p.renderRate.y
        //const _fontSize = fontSize / _fontRate;
        const width = this.textCanvas.width;
        const maxSize = width;

        _textOption.setCtxFontOption(this.ctx, _fontRate);

        const m = this.ctx.measureText(text);
        const p1 = P.scratchToLocalPos(x, y)
        const p2 = P.toActualPosition(p1.x, p1.y)
        const _x = p2.x - ((maxSize > m.width)? m.width / 2 : maxSize/2);
        const _y = p2.y +  m.fontBoundingBoxAscent / 2;
        this.ctx.fillText(text, _x, _y, maxSize);

        return m;
    }
    textDrawer( text, x, y, fontSize, fontName, color) {
        const _preloadImagePromise = PlayGround.default;
        const _fontRate = (pg.renderRate.x > pg.renderRate.y )? pg.renderRate.x : pg.renderRate.y
        const _fontSize = fontSize / _fontRate;
        const width = this.textCanvas.width;
        const maxSize = width;
        this.ctx.font = `${_fontSize}px ${fontName}`
        this.ctx.fillStyle = color;
        this.ctx.shadowColor ="black";
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.ctx.shadowBlur = 10;
        const m = this.ctx.measureText(text);
        
        const p1 = pg.scratchToLocalPos(x, y)
        const p2 = pg.toActualPosition(p1.x, p1.y)
        const _x = p2.x - ((maxSize > m.width)? m.width / 2 : maxSize/2);
        const _y = p2.y +  m.fontBoundingBoxAscent / 2;
        this.ctx.fillText(text, _x, _y, maxSize);

        return m;
    }
    
};

module.exports = TextDraw;