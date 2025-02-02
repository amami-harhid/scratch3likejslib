const Canvas = require('./canvas');
const Element = require('./element');
const Process = require('./process');
const ScratchRenderer = require('scratch-render');
const StageLayering = require('./stageLayering');
const Render = class {
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
        this.createRenderer();
        const me = this;
        const main = Process.default.main;
        const flag = Process.default.flag;
        const resizeWindow = function() {
            Element.mainPositioning(main);
            if(flag){
                Element.flagPositioning(flag);
            }

            me.stageResize();
        };
        window.addEventListener('resize', resizeWindow);
    }
    stageResize(w = Render.W , h = Render.H) {
        this.renderer.resize( w, h );
        // ↓ ないほうがよい。理由は追及していない。
        //this.renderer.setStageSize( - w/2, w/2, - h/2, h/2 );
        const _nativeSize = this.renderer.getNativeSize ();
        this.stageWidth = _nativeSize[0];
        this.stageHeight = _nativeSize[1];

        Canvas.resize2DContext( w, h);

    }
    createRenderer (w = Render.W , h = Render.H ) {
        this.canvas = Element.canvas;
        this.renderer = new ScratchRenderer(canvas);
        this.renderer.setLayerGroupOrdering(this.layerGroups);
        this.stageResize(w,h);
    }

    createDrawable(layer) {
        const drawableID = this.renderer.createDrawable(layer);
        return drawableID;
    }
};

module.exports = Render;