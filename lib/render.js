const Canvas = require("./canvas");
const Element = require("./element");
const playGround = require("./playGround");
const ScratchRender = require('scratch-render');
//import { ScratchRender } from 'scratch-render';
const StageLayering = require("./stageLayering");

class Render {
    static get WHRate() {
        return 0.75;
    }
    static get W() {
        //const Scratch3StageWidth = 240;
        const WHRate = Render.WHRate; // ( 3/4 )
        const InnerWidthRate = 0.95;// 0.95; //0.8;
        const InnerHeightRate = 0.95;
        let w = innerWidth / devicePixelRatio * InnerWidthRate;
        let h = w * WHRate;
        const hLimit = innerHeight / devicePixelRatio * InnerHeightRate;
        if( h > hLimit ) {
            h = hLimit;
            w = h / WHRate;
        }
        return w;
    }
    static get H() {
        return Render.W * Render.WHRate;
    }
    constructor(layerGroups = StageLayering.LAYER_GROUPS) {
        this.layerGroups = layerGroups;
        this.stageWidth = 0;
        this.stageHeight = 0;
        this._renderer = null;
        this.canvas = null;
        this.createRenderer();
        const me = this;
        const resizeWindow = function() {
            const main = playGround.default.main;
            Element.mainPositioning(main);
            me.stageResize();
        };
        window.addEventListener('resize', resizeWindow);
    }
    stageResize(w = Render.W , h = Render.H) {
        if(this._renderer){
            this._renderer.resize( w, h ); // stage(canvas)のサイズ property(width,height)の値をリサイズ
            const _nativeSize = this._renderer.getNativeSize ();
            this.stageWidth = _nativeSize[0];
            this.stageHeight = _nativeSize[1];
            Canvas.resize2DContext( w, h);
            Render.monitorCanvasResize( w, h);    
        }
    }
    static monitorCanvasResize(w = Render.W , h = Render.H) {
        Canvas.resizeMonitorCanvas(w, h);

    }
    createRenderer (w = Render.W , h = Render.H ) {
        this.canvas = Element.canvas;
        this._renderer = new ScratchRender(this.canvas);
        if(this._renderer){
            this._renderer.setLayerGroupOrdering(this.layerGroups);
            this.stageResize(w,h);    
        }    
}

    createDrawable(layer)  {
        if(this._renderer){
            const drawableID = this._renderer.createDrawable(layer);
            return drawableID;    
        }
        throw `'createDrawable' failed, renderer is null `;
    }
    get renderer() {
        if(this._renderer == undefined) throw 'Not found renderer error';
        return this._renderer;
    }
    
};
module.exports = Render;