const Canvas = require('../canvas');
const EventEmitter = require('events').EventEmitter;
const Render = require('../render');
const S3CanvasMeasurementProvider = require('./s3-canvas-measurement-provider');
const S3RenderConstants = require('./s3RenderConstants');
const S3Silhouette = require('./s3Silhouette');
const S3TextWrapper = require('./s3-text-wrapper');
const twgl = require('twgl.js');
const MonitorStyle = {
    MAX_LINE_WIDTH: 480,  // stage width
    PADDING_VALUE_VIRTICAL: 5, // Padding around the value text area
    PADDING: 10, // Padding around the text area
    MIN_WIDTH: 50, // Minimum value area width, in Scratch pixels
    STROKE_WIDTH: 2, // Thickness of the stroke around the monitor. Only half's visible because it's drawn under the fill
    CORNER_RADIUS: 3, // Radius of the rounded corners
    FONT: 'Osaka-Mono', // Font to render the text with
    FONT_SIZE: 10, // Font size, in Scratch pixels
    FONT_HEIGHT_RATIO: 0.5, // Height, in Scratch pixels, of the text, as a proportion of the font's size
    LINE_HEIGHT: 11, // Spacing between each line of text

    COLORS: {
        FILL: 'rgba(250,250,250,0.9)',
        STROKE: 'rgba(190, 190, 190, 0.9)',
        TEXT_FILL: '#000000',
        DROP_FILL: 'rgba(200,200,200,0.9)',
        DROP_STROKE: 'rgba(190, 190, 190, 0.2)',
    },
    VALUE_COLORS: {
        FILL: 'rgba(255, 165, 0, 0.8)',
        STROKE: 'rgba(255, 165, 0, 0.8)',
        TEXT_FILL: '#ffffff'
    }

};
class S3MonitorSkin extends EventEmitter {

    /**
     * Create a S3Skin, which stores and/or generates textures for use in rendering.
     * @param {int} id - The unique ID for this S3Skin.
     * @param {!RenderWebGL} renderer - The renderer which will use this skin.
     * @param {string} title - monitor title
     * @constructor
     */
    constructor (id, renderer, title, x=0, y=0) {
        super();
        /** @type {int} */
        this._id = id;
        /** @type {RenderWebGL} */
        this._renderer = renderer;
        //console.log('createMonitorCanvas')
        //Render.monitorCanvasResize();
        /** @type {Array<number>} */
        this._size = [0, 0];
        /** @type {number} */
        this._renderedScale = 0;
        /** @type {Array<string>} */
        this._lines = [];
        /** @type {string} */
        this._title = title;
        /** @type {object} */
        this._textAreaSize = {width: 0, height: 0};
        /** @type {boolean} */
        this._textDirty = true;
        /** @type {boolean} */
        this._textureDirty = true;
        /** @type {Vec3} */
        this._rotationCenter = twgl.v3.create(0, 0);
        /** @type {WebGLTexture} */
        this._texture = null;
        /**
         * The uniforms to be used by the vertex and pixel shaders.
         * Some of these are used by other parts of the renderer as well.
         * @type {Object.<string,*>}
         * @private
         */
        this._uniforms = {
            /**
             * The nominal (not necessarily current) size of the current skin.
             * @type {Array<number>}
             */
            u_skinSize: [0, 0],

            /**
             * The actual WebGL texture object for the skin.
             * @type {WebGLTexture}
             */
            u_skin: null
        };
        /**
         * A silhouette to store touching data, skins are responsible for keeping it up to date.
         * @private
         */
        this._silhouette = new S3Silhouette();

        this._x = x;
        this._y = y;
        this._visible = true;
        this.createCanvas();
        this._restyleCanvas();

        /** drop */
        this._dropping = false;

    }
    get dropping( ) {
        return this._dropping;
    }
    set dropping( _dropping ) {
        this._dropping = _dropping;
    }
    createCanvas(){
        /** @type {HTMLCanvasElement} */
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d', { willReadFrequently: true });
        this.measurementProvider = new S3CanvasMeasurementProvider(this._ctx);
        this.textWrapper = new S3TextWrapper(this.measurementProvider);

    }
    getDefaultHeight(){
        const paddedHeight = (MonitorStyle.FONT_HEIGHT_RATIO*MonitorStyle.LINE_HEIGHT) 
                    + (MonitorStyle.PADDING * 2);
        return paddedHeight;
    }
    /**
     * Dispose of this object. Do not use it after calling this method.
     */
    dispose () {
        if (this._texture) {
            this._renderer.gl.deleteTexture(this._texture);
            this._texture = null;
        }
        this._canvas = null;
        this._id = S3RenderConstants.ID_NONE;
    }
    /**
     * @return {int} the unique ID for this Skin.
     */
    get id () {
        return this._id;
    }
    get rotationCenter () {
        return this._rotationCenter;
    }
    /**
     * @return {Array<number>} the "native" size, in texels, of this skin.
     */
    get size () {
        if (this._textDirty) {
            this._reflowLines();
        }
        return this._size;
    }
    /**
     * Should this skin's texture be filtered with nearest-neighbor or linear interpolation at the given scale?
     * @param {?Array<Number>} scale The screen-space X and Y scaling factors at which this skin's texture will be
     * displayed, as percentages (100 means 1 "native size" unit is 1 screen pixel; 200 means 2 screen pixels, etc).
     * @param {Drawable} drawable The drawable that this skin's texture will be applied to.
     * @return {boolean} True if this skin's texture, as returned by {@link getTexture}, should be filtered with
     * nearest-neighbor interpolation.
     */
    useNearest (scale, drawable) {
        return true;
    }

    get x () {
        return this._x;
    }
    get y () {
        return this._y;
    }
    set x (_x) {
        this._x = _x;
    }
    set y (_y) {
        this._y = _y;
    }
    /**
     * textAreaSize
     * @return {Array<number>} textAreaSize 
     */
    get textAreaSize() {
        return this._textAreaSize;
    }
    /**
     * Get the center of the current bounding box
     * @returns {Array<number>} the center of the current bounding box
     */
    calculateRotationCenter () {
        return [this.size[0] / 2, this.size[1] / 2];
    }
    /**
     * @param {Array<number>} scale - The scaling factors to be used.
     * @return {WebGLTexture} The GL texture representation of this skin when drawing at the given size.
     */
    getTexture (scale) {
        // The texture only ever gets uniform scale. Take the larger of the two axes.
        const scaleMax = scale ? Math.max(Math.abs(scale[0]), Math.abs(scale[1])) : 100;
        const requestedScale = scaleMax / 100;
        // If we already rendered the text monitor at this scale, we can skip re-rendering it.
        if (this._textureDirty || this._renderedScale !== requestedScale) {
            this._renderTextMonitor(requestedScale);
            this._textureDirty = false;

            const textureData = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);

            const gl = this._renderer.gl;

            if (this._texture === null) {
                const textureOptions = {
                    auto: false,
                    wrap: gl.CLAMP_TO_EDGE
                };

                this._texture = twgl.createTexture(gl, textureOptions);
            }

            this._setTexture(textureData);
        }

        return this._texture;
    }
    /**
     * If the skin defers silhouette operations until the last possible minute,
     * this will be called before isTouching uses the silhouette.
     */
    updateSilhouette (scale = [100, 100]) {
        this.getTexture(scale);
    }    
    /**
     * Set this skin's texture to the given image.
     * @param {ImageData|HTMLCanvasElement} textureData - The canvas or image data to set the texture to.
     */
    _setTexture (textureData) {
        const gl = this._renderer.gl;
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureData);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        this._silhouette.update(textureData);
    }
    show() {
        this._visible = true;
    }
    hide() {
        this._visible = false;
    }
    /**
     * Set parameters for this text monitor.
     * @param {string} text 
     */
    set value (_value) {
        this._text = _value;
        this._textDirty = true;
        this._textureDirty = true;
        this.emit(S3MonitorSkin.Events.WasAltered);
    }
    get value() {
        return this._text;
    }
    _restyleCanvas () {
        this._canvas.getContext('2d').font = `${MonitorStyle.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
    }
    /**
     * Update the array of wrapped lines and the text dimensions.
     */
    _reflowLines () {
        this._restyleCanvas();
        // Measure width of title line
        const _titleLineWidth = this.measurementProvider.measureText(''+this._title);
        const titleLineWidth = _titleLineWidth;
        this.titleLineWidth = titleLineWidth;
        this._lines = [''+ this._text]; // always one line, not used line breaker
        // Measure width of longest line to avoid extra-wide bubbles
        const _valueLineWidth = this.measurementProvider.measureText(''+this._text);
        const valueLineWidth = Math.max(_valueLineWidth, MonitorStyle.MIN_WIDTH);
        this.valueLineWidth = valueLineWidth;
        this.actualValueLineWidth = _valueLineWidth;

        const paddedWidth = MonitorStyle.PADDING + titleLineWidth + MonitorStyle.PADDING
                        +  valueLineWidth + MonitorStyle.PADDING;
        const paddedHeight = (MonitorStyle.FONT_HEIGHT_RATIO*MonitorStyle.LINE_HEIGHT) 
                        + (MonitorStyle.PADDING * 2);

        this._textAreaSize.width = paddedWidth;
        this._textAreaSize.height = paddedHeight;

        this._size[0] = paddedWidth + MonitorStyle.STROKE_WIDTH + MonitorStyle.CORNER_RADIUS * 2;
        this._size[1] = paddedHeight + MonitorStyle.STROKE_WIDTH + MonitorStyle.CORNER_RADIUS * 2;

        this._textDirty = false;
    }
    /**
     * Render this text monitor at a certain scale, using the current parameters, to the canvas.
     * @param {*} scale 
     */
    _renderTextMonitor (scale) {
        const _scale = scale;
        const ctx = this._ctx;
        if (this._textDirty) {
            this._reflowLines();
        }
        // Calculate the canvas-space sizes of the padded text area and full text monitor
        const paddedWidth = this._textAreaSize.width;
        const paddedHeight = this._textAreaSize.height;

        // Resize the canvas to the correct screen-space size
        this._canvas.width = Math.ceil(this._size[0] * _scale);
        this._canvas.height = Math.ceil(this._size[1] * _scale);

        this._restyleCanvas();
        if(this._visible === true){
            // Reset the transform before clearing to ensure 100% clearage
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
            ctx.scale(scale, scale);
            ctx.translate(MonitorStyle.PADDING * 0.5, 
                MonitorStyle.PADDING * 0.5);
            
            ctx.save();
            // Draw the monitor's rounded borders
            ctx.beginPath();
            ctx.moveTo(MonitorStyle.CORNER_RADIUS, paddedHeight);
            ctx.arcTo(0, paddedHeight, 0, paddedHeight - MonitorStyle.CORNER_RADIUS, 
                MonitorStyle.CORNER_RADIUS);
            ctx.arcTo(0, 0, paddedWidth, 0, 
                MonitorStyle.CORNER_RADIUS);
            ctx.arcTo(paddedWidth, 0,
                paddedWidth, paddedHeight, 
                MonitorStyle.CORNER_RADIUS);
            ctx.arcTo(paddedWidth, paddedHeight, 
                MonitorStyle.CORNER_RADIUS, paddedHeight,
                MonitorStyle.CORNER_RADIUS);
            ctx.lineTo(MonitorStyle.CORNER_RADIUS, paddedHeight);

            // Translate the canvas so we don't have to do a bunch of width/height arithmetic
            ctx.save();
            ctx.translate(paddedWidth - MonitorStyle.CORNER_RADIUS, paddedHeight);
            ctx.restore();
            if(this._dropping === true){
                // ドロップ中には色合いを変える
                ctx.fillStyle = MonitorStyle.COLORS.DROP_FILL;
                ctx.strokeStyle = MonitorStyle.COLORS.DROP_STROKE;    
            }else{
                ctx.fillStyle = MonitorStyle.COLORS.FILL;
                ctx.strokeStyle = MonitorStyle.COLORS.STROKE;    
            }
            ctx.lineWidth = MonitorStyle.STROKE_WIDTH;
            ctx.stroke();
            ctx.fill();
            // Un-flip the canvas if it was flipped
            ctx.restore();

            // Draw value area
            ctx.beginPath();
            const valueAreaHorizonStart = MonitorStyle.PADDING + this.titleLineWidth
            const valueHeight = paddedHeight-MonitorStyle.PADDING_VALUE_VIRTICAL*2;
            let x00 = valueAreaHorizonStart+MonitorStyle.CORNER_RADIUS;
            let y00 = valueHeight+MonitorStyle.PADDING_VALUE_VIRTICAL;
            ctx.moveTo(x00, y00);
            let x01_01 = valueAreaHorizonStart;
            let y01_01 = y00;
            let x01_02 = x01_01;
            let y01_02 = valueHeight - MonitorStyle.CORNER_RADIUS;
            ctx.arcTo(x01_01, y01_01, x01_02, y01_02, MonitorStyle.CORNER_RADIUS);
            let x02_01 = x01_02;
            let y02_01 = MonitorStyle.PADDING_VALUE_VIRTICAL;
            let x02_02 = this.valueLineWidth+MonitorStyle.CORNER_RADIUS;
            let y02_02 = y02_01;
            ctx.arcTo(x02_01,y02_01, x02_02, y02_02, MonitorStyle.CORNER_RADIUS);
            let x03_01 = valueAreaHorizonStart+this.valueLineWidth+MonitorStyle.PADDING_VALUE_VIRTICAL+MonitorStyle.CORNER_RADIUS;
            let y03_01 = y02_01;
            let x03_02 = x03_01;
            let y03_02 = y01_01;
            ctx.arcTo(x03_01, y03_01, x03_02, y03_02, MonitorStyle.CORNER_RADIUS);
            let x04_01 = x03_01;
            let y04_01 = y01_01;
            let x04_02 = valueAreaHorizonStart+MonitorStyle.PADDING_VALUE_VIRTICAL+MonitorStyle.CORNER_RADIUS;
            let y04_02 = y04_01;
            ctx.arcTo(x04_01, y04_01, x04_02, y04_02, MonitorStyle.CORNER_RADIUS);
            let x05_01 = x00;
            let y05_01 = y00;
            ctx.lineTo(x05_01, y05_01);                        

            ctx.fillStyle = MonitorStyle.VALUE_COLORS.FILL;
            ctx.strokeStyle = MonitorStyle.VALUE_COLORS.STROKE;
            ctx.lineWidth = 0;
            ctx.stroke();
            ctx.fill();
        
            // Draw title line 
            const firtLineTop = MonitorStyle.PADDING + (MonitorStyle.FONT_HEIGHT_RATIO * MonitorStyle.FONT_SIZE);
            ctx.fillStyle = MonitorStyle.COLORS.TEXT_FILL;
            ctx.font = `bold ${MonitorStyle.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
            ctx.fillText(this._title, MonitorStyle.CORNER_RADIUS, firtLineTop);

            // Draw each line of text (centering)
            ctx.fillStyle = MonitorStyle.VALUE_COLORS.TEXT_FILL;
            ctx.font = `${MonitorStyle.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
            const valueStartPosition = this.titleLineWidth + MonitorStyle.PADDING + MonitorStyle.CORNER_RADIUS;
            let _valueStartPosition = valueStartPosition
                        + (this.valueLineWidth - this.actualValueLineWidth)/2;
            ctx.fillText(this._text, _valueStartPosition, firtLineTop);

        }
        this._renderedScale = scale;
    }
    /*
     * Update and returns the uniforms for this skin.
     * @param {Array<number>} scale - The scaling factors to be used.
     * @returns {object.<string, *>} the shader uniforms to be used when rendering with this Skin.
     */
    getUniforms (scale) {
       this._uniforms.u_skin = this.getTexture(scale);
       this._uniforms.u_skinSize = this.size;
       return this._uniforms;
    }
    /**
     * Does this point touch an opaque or translucent point on this skin?
     * Nearest Neighbor version
     * The caller is responsible for ensuring this skin's silhouette is up-to-date.
     * @see updateSilhouette
     * @see Drawable.updateCPURenderAttributes
     * @param {twgl.v3} vec A texture coordinate.
     * @return {boolean} Did it touch?
     */
    isTouchingNearest (vec) {
        return this._silhouette.isTouchingNearest(vec); 
    }

    /**
     * Does this point touch an opaque or translucent point on this skin?
     * Linear Interpolation version
     * The caller is responsible for ensuring this skin's silhouette is up-to-date.
     * @see updateSilhouette
     * @see Drawable.updateCPURenderAttributes
     * @param {twgl.v3} vec A texture coordinate.
     * @return {boolean} Did it touch?
     */
    isTouchingLinear (vec) {
        return this._silhouette.isTouchingLinear(vec);
    }

}
/**
 * These are the events which can be emitted by instances of this class.
 * @enum {string}
 */
S3MonitorSkin.Events = {
    /**
     * This constant value is same as Skin class
     * Emitted when anything about the Skin has been altered, such as the appearance or rotation center.
     * @event S3MonitorSkin.event:WasAltered
     */
    WasAltered: 'WasAltered'
};
module.exports = S3MonitorSkin;    
