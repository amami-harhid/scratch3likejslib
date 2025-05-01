const Canvas = require('../canvas');
const EventEmitter = require('events').EventEmitter;
const Libs = require('../libs');
const Render = require('../render');
const S3CanvasMeasurementProvider = require('./s3-canvas-measurement-provider');
const S3RenderConstants = require('./s3RenderConstants');
const S3TextWrapper = require('./s3-text-wrapper');
const twgl = require('twgl.js');
const MonitorStyle = {
    MAX_LINE_WIDTH: 480,  // stage width
    PADDING_VALUE_VIRTICAL: 5, // Padding around the value text area
    PADDING: 10, // Padding around the text area
    MIN_WIDTH: 50, // Minimum value area width, in Scratch pixels
    STROKE_WIDTH: 4, // Thickness of the stroke around the monitor. Only half's visible because it's drawn under the fill
    CORNER_RADIUS: 3, // Radius of the rounded corners
    FONT: 'Helvetica', // Font to render the text with
    FONT_SIZE: 10, // Font size, in Scratch pixels
    FONT_HEIGHT_RATIO: 0.5, // Height, in Scratch pixels, of the text, as a proportion of the font's size
    LINE_HEIGHT: 10, // Spacing between each line of text

    COLORS: {
        FILL: 'rgba(250,250,250,0.9)',
        STROKE: 'rgba(190, 190, 190, 0.9)',
        TEXT_FILL: '#000000'
    },
    VALUE_COLORS: {
        FILL: 'rgba(255, 165, 0, 0.8)',
        STROKE: 'rgba(255, 165, 0, 0.8)',
        TEXT_FILL: '#ffffff'
    }

};
const MonitorStyleResized = {
    MAX_LINE_WIDTH: MonitorStyle.MAX_LINE_WIDTH,
    PADDING_VALUE_VIRTICAL: MonitorStyle.PADDING_VALUE_VIRTICAL,
    PADDING: MonitorStyle.PADDING,
    MIN_WIDTH: MonitorStyle.MIN_WIDTH,
    STROKE_WIDTH: MonitorStyle.STROKE_WIDTH,
    CORNER_RADIUS: MonitorStyle.CORNER_RADIUS,
    FONT_SIZE: MonitorStyle.FONT_SIZE,
    LINE_HEIGHT: MonitorStyle.LINE_HEIGHT,
};
class S3MonitorSkin extends EventEmitter {

    renderRate() {
        const rate = Libs.default.renderRate;
        const _rate = Math.min( rate.x, rate.y );
        MonitorStyleResized.MAX_LINE_WIDTH = Math.ceil(MonitorStyle.MAX_LINE_WIDTH / _rate);
        MonitorStyleResized.PADDING_VALUE_VIRTICAL = Math.ceil(MonitorStyle.PADDING_VALUE_VIRTICAL / _rate);
        MonitorStyleResized.PADDING = Math.ceil(MonitorStyle.PADDING / _rate);
        MonitorStyleResized.MIN_WIDTH = Math.ceil(MonitorStyle.MIN_WIDTH / _rate);
        MonitorStyleResized.STROKE_WIDTH = Math.ceil(MonitorStyle.STROKE_WIDTH / _rate);
        MonitorStyleResized.CORNER_RADIUS = Math.ceil(MonitorStyle.CORNER_RADIUS / _rate);
        MonitorStyleResized.FONT_SIZE = Math.ceil(MonitorStyle.FONT_SIZE / _rate);
        MonitorStyleResized.LINE_HEIGHT = Math.ceil(MonitorStyle.LINE_HEIGHT / _rate);
        return _rate;
    }

    /**
     * Create a S3Skin, which stores and/or generates textures for use in rendering.
     * @param {int} id - The unique ID for this S3Skin.
     * @param {!RenderWebGL} renderer - The renderer which will use this skin.
     * @param {string} title - monitor title
     * @constructor
     */
    constructor (id, renderer, title) {
        super();
        /** @type {int} */
        this._id = id;
        /** @type {RenderWebGL} */
        this._renderer = renderer;
        /** @type {HTMLCanvasElement} */
        this._canvas = Canvas.createMonitorCanvas();
        Render.monitorCanvasResize();
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
        this._ctx = this._canvas.getContext('2d', { willReadFrequently: true });
        this.measurementProvider = new S3CanvasMeasurementProvider(this._ctx);
        this.textWrapper = new S3TextWrapper(this.measurementProvider);
        this._restyleCanvas();

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
     * Set this skin's texture to the given image.
     * @param {ImageData|HTMLCanvasElement} textureData - The canvas or image data to set the texture to.
     */
    _setTexture (textureData) {
        const gl = this._renderer.gl;
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureData);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    }
    /**
     * Set parameters for this text monitor.
     * @param {*} text 
     */
    setTextMonitor (text) {
        this._text = ''+ text;
        this._textDirty = true;
        this._textureDirty = true;
    }
    _restyleCanvas () {
        this._canvas.getContext('2d').font = `${MonitorStyleResized.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
    }
    /**
     * Update the array of wrapped lines and the text dimensions.
     */
    _reflowLines () {
        const _rate = this.renderRate();

        // Measure width of title line
        const _titleLineWidth = this.measurementProvider.measureText(this._title);
        const titleLineWidth = _titleLineWidth;
        this.titleLineWidth = titleLineWidth;
        //this._lines = this.textWrapper.wrapText(MonitorStyleResized.MAX_LINE_WIDTH, this._text);
        this._lines = [this._text]; // always one line, not used line breaker
        // Measure width of longest line to avoid extra-wide bubbles
        const _valueLineWidth = this.measurementProvider.measureText(this._text);
        const valueLineWidth = Math.max(_valueLineWidth, MonitorStyleResized.MIN_WIDTH);
        this.valueLineWidth = valueLineWidth;
        // Calculate the canvas-space sizes of the padded text area and full text bubble
        //const paddedWidth = Math.max(longestLineWidth, MonitorStyleResized.MIN_WIDTH) + (MonitorStyleResized.PADDING * 2) +MonitorStyleResized.CORNER_RADIUS * 2;
        //const paddedHeight = (MonitorStyleResized.LINE_HEIGHT * this._lines.length) + (MonitorStyleResized.PADDING * 2);

        const paddedWidth = MonitorStyleResized.PADDING + titleLineWidth + MonitorStyleResized.PADDING
                        +  valueLineWidth + MonitorStyleResized.PADDING;
        const paddedHeight = (MonitorStyle.FONT_HEIGHT_RATIO*MonitorStyleResized.LINE_HEIGHT) 
                        + (MonitorStyleResized.PADDING * 2);
        this._textAreaSize.width = paddedWidth;
        this._textAreaSize.height = paddedHeight;

        this._size[0] = paddedWidth + MonitorStyleResized.STROKE_WIDTH + MonitorStyleResized.CORNER_RADIUS * 2;
        this._size[1] = paddedHeight + MonitorStyleResized.STROKE_WIDTH;

        this._textDirty = false;
    }
    /**
     * Render this text monitor at a certain scale, using the current parameters, to the canvas.
     * @param {*} scale 
     */
    _renderTextMonitor (scale) {
        const _rate = this.renderRate();
        const _scale = scale / _rate;
        const ctx = this._ctx;
        if (this._textDirty) {
            this._reflowLines();
        }
        // Calculate the canvas-space sizes of the padded text area and full text monitor
        const paddedWidth = this._textAreaSize.width;
        const paddedHeight = this._textAreaSize.height;

        // Resize the canvas to the correct screen-space size
//        this._canvas.width = Math.ceil(this._size[0] * _scale);
//        this._canvas.height = Math.ceil(this._size[1] * _scale);

        this._restyleCanvas();
        // Reset the transform before clearing to ensure 100% clearage
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        ctx.scale(scale, scale);
        ctx.translate(MonitorStyleResized.PADDING * 0.5, MonitorStyleResized.PADDING * 0.5);
        ctx.save();
        // Draw the monitor's rounded borders
        ctx.beginPath();
        ctx.moveTo(MonitorStyleResized.CORNER_RADIUS, paddedHeight);
        ctx.arcTo(0, paddedHeight, 0, paddedHeight - MonitorStyleResized.CORNER_RADIUS, 
            MonitorStyleResized.CORNER_RADIUS);
        ctx.arcTo(0, 0, paddedWidth, 0, 
            MonitorStyleResized.CORNER_RADIUS);
        ctx.arcTo(paddedWidth, 0,
                    paddedWidth, paddedHeight, 
                    MonitorStyleResized.CORNER_RADIUS);
        ctx.arcTo(paddedWidth, paddedHeight, 
            MonitorStyleResized.CORNER_RADIUS, paddedHeight,
            MonitorStyleResized.CORNER_RADIUS);
        ctx.lineTo(MonitorStyleResized.CORNER_RADIUS, paddedHeight);
        // Translate the canvas so we don't have to do a bunch of width/height arithmetic
        ctx.save();
        ctx.translate(paddedWidth - MonitorStyleResized.CORNER_RADIUS, paddedHeight);
        ctx.restore();
        ctx.fillStyle = MonitorStyle.COLORS.FILL;
        ctx.strokeStyle = MonitorStyle.COLORS.STROKE;
        ctx.lineWidth = MonitorStyleResized.STROKE_WIDTH;
        ctx.stroke();
        ctx.fill();
        // Un-flip the canvas if it was flipped
        ctx.restore();

        // Draw value area
        ctx.beginPath();
        const valueAreaHorizonStart = MonitorStyleResized.PADDING*2 + this.titleLineWidth
        const valueHeight = paddedHeight-MonitorStyleResized.PADDING_VALUE_VIRTICAL*2;
        console.log(`paddedHeight=${paddedHeight}`)
        console.log(`valueHeight=${valueHeight}`)
        ctx.moveTo(valueAreaHorizonStart+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL);
        ctx.arcTo(valueAreaHorizonStart, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL,
                valueAreaHorizonStart, valueHeight - MonitorStyleResized.CORNER_RADIUS, 
                MonitorStyleResized.CORNER_RADIUS);
        ctx.arcTo(valueAreaHorizonStart, 
                MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                MonitorStyleResized.CORNER_RADIUS);
        ctx.arcTo(valueAreaHorizonStart+this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                MonitorStyleResized.PADDING_VALUE_VIRTICAL,
                valueAreaHorizonStart+this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                MonitorStyleResized.CORNER_RADIUS);
        ctx.arcTo(valueAreaHorizonStart+this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                valueAreaHorizonStart+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL,
                MonitorStyleResized.CORNER_RADIUS);
        ctx.lineTo(valueAreaHorizonStart+MonitorStyleResized.CORNER_RADIUS, 
            valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL);                        

        ctx.fillStyle = MonitorStyle.VALUE_COLORS.FILL;
        ctx.strokeStyle = MonitorStyle.VALUE_COLORS.STROKE;
        ctx.lineWidth = 0;
        ctx.stroke();
        ctx.fill();
        
        // Draw title line 
        const firtLineTop = MonitorStyleResized.PADDING + (MonitorStyle.FONT_HEIGHT_RATIO * MonitorStyleResized.FONT_SIZE);
        ctx.fillStyle = MonitorStyle.COLORS.TEXT_FILL;
        ctx.font = `${MonitorStyleResized.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
        console.log(`this._title=${this._title}`)
        ctx.fillText(
            this._title,
            MonitorStyleResized.CORNER_RADIUS,
            firtLineTop
        );

        // Draw each line of text
        ctx.fillStyle = MonitorStyle.VALUE_COLORS.TEXT_FILL;
        ctx.font = `${MonitorStyleResized.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
        const valueStartPosition = this.titleLineWidth + MonitorStyleResized.PADDING*2;
        let _valueStartPosition = valueStartPosition;
        if(MonitorStyleResized.MIN_WIDTH > this.titleLineWidth ){
            _valueStartPosition += (MonitorStyleResized.MIN_WIDTH - this.titleLineWidth)/2;
        }
        ctx.fillText(
            this._text,
            //MonitorStyleResized.CORNER_RADIUS,
            _valueStartPosition,
            firtLineTop                 
            //MonitorStyleResized.PADDING + (MonitorStyleResized.LINE_HEIGHT * lineNumber) +
            //     (MonitorStyle.FONT_HEIGHT_RATIO * MonitorStyleResized.FONT_SIZE)
        );
        this._renderedScale = scale;
    }
}
module.exports = S3MonitorSkin;    
