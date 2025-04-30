const EventEmitter = require('events').EventEmitter;
const twgl = require('twgl.js');
const S3CanvasMeasurementProvider = require('./s3-canvas-measurement-provider');
const S3RenderConstants = require('./s3RenderConstants');
const S3TextWrapper = require('./s3-text-wrapper');
const S3MonitorImage = require('./s3MonitorImage');
const MonitorStyle = {
    MAX_LINE_WIDTH: 60, // Maximum width, in Scratch pixels, of a single line of text
//    MAX_LINE_WIDTH: 170, // Maximum width, in Scratch pixels, of a single line of text

    MIN_WIDTH: 50, // Minimum width, in Scratch pixels, of a text bubble
    STROKE_WIDTH: 4, // Thickness of the stroke around the monitor. Only half's visible because it's drawn under the fill
    PADDING: 10, // Padding around the text area
    CORNER_RADIUS: 16, // Radius of the rounded corners

    FONT: 'Helvetica', // Font to render the text with
    FONT_SIZE: 14, // Font size, in Scratch pixels
    FONT_HEIGHT_RATIO: 0.9, // Height, in Scratch pixels, of the text, as a proportion of the font's size
    LINE_HEIGHT: 16, // Spacing between each line of text

    COLORS: {
//        FILL: 'white',
        FILL: 'rgba(50,50,50,0.5)',
        STROKE: 'rgba(0, 0, 0, 0.15)',
//        STROKE: 'rgba(255, 0, 0, 1)',
        TEXT_FILL: '#ffffff'
//        TEXT_FILL: '#575E75'
    }
};
class S3MonitorSkin extends EventEmitter {
    /**
     * Create a S3Skin, which stores and/or generates textures for use in rendering.
     * @param {int} id - The unique ID for this S3Skin.
     * @param {!RenderWebGL} renderer - The renderer which will use this skin. 
     * @constructor
     */
    constructor (id, renderer) {
        super();
        /** @type {int} */
        this._id = id;
        /** @type {RenderWebGL} */
        this._renderer = renderer;
        /** @type {HTMLCanvasElement} */
        this._canvas = document.getElementById('canvas-text2D');
        /** @type {Array<number>} */
        this._size = [0, 0];
        /** @type {number} */
        this._renderedScale = 0;
         /** @type {Array<string>} */
         this._lines = [];
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
        console.log(this._canvas);
        this._ctx = this._canvas.getContext('2d', { willReadFrequently: true });
        console.log(this._ctx)
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
        console.log(`【1】scale = ${scale}`)
        console.log(`【2】this._canvas.width, this._canvas.height = ${this._canvas.width},${this._canvas.height}`)
        // The texture only ever gets uniform scale. Take the larger of the two axes.
        const scaleMax = scale ? Math.max(Math.abs(scale[0]), Math.abs(scale[1])) : 100;
        console.log(`【3】scaleMax = ${scaleMax}`)
        const requestedScale = scaleMax / 100;
        // If we already rendered the text monitor at this scale, we can skip re-rendering it.
        if (this._textureDirty || this._renderedScale !== requestedScale) {
            this._renderTextMonitor(requestedScale);
            this._textureDirty = false;

//            const context = this._canvas.getContext('2d', { willReadFrequently: true });
//            const context = this._canvas.getContext('2d');
            console.log(`【4】this._canvas.width, this._canvas.height = ${this._canvas.width},${this._canvas.height}`)
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
        this._text = text;
        this._textDirty = true;
        this._textureDirty = true;
    }
    _restyleCanvas () {
        //this._canvas.getContext('2d').font = `${MonitorStyle.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
    }
    /**
     * Update the array of wrapped lines and the text dimensions.
     */
    _reflowLines () {
        this._lines = this.textWrapper.wrapText(MonitorStyle.MAX_LINE_WIDTH, this._text);
        // Measure width of longest line to avoid extra-wide bubbles
        let longestLineWidth = 0;
        for (const line of this._lines) {
            longestLineWidth = Math.max(longestLineWidth, this.measurementProvider.measureText(line));
        }
        // Calculate the canvas-space sizes of the padded text area and full text bubble
        const paddedWidth = Math.max(longestLineWidth, MonitorStyle.MIN_WIDTH) + (MonitorStyle.PADDING * 2);
        const paddedHeight = (MonitorStyle.LINE_HEIGHT * this._lines.length) + (MonitorStyle.PADDING * 2);

        this._textAreaSize.width = paddedWidth + MonitorStyle.CORNER_RADIUS;
        this._textAreaSize.height = paddedHeight;

        this._size[0] = paddedWidth + MonitorStyle.STROKE_WIDTH + MonitorStyle.CORNER_RADIUS;
        this._size[1] = paddedHeight + MonitorStyle.STROKE_WIDTH;

        this._textDirty = false;
    }
    /**
     * Render this text monitor at a certain scale, using the current parameters, to the canvas.
     * @param {*} scale 
     */
    _renderTextMonitor (scale) {
        const ctx = this._ctx;
        console.log(`_renderTextMonitor【1】scale = ${scale}`)
        console.log(`_renderTextMonitor【2】this._canvas.width, this._canvas.height = ${this._canvas.width},${this._canvas.height}`)
        if (this._textDirty) {
            this._reflowLines();
        }
        console.log(`_renderTextMonitor【3】this._canvas.width, this._canvas.height = ${this._canvas.width},${this._canvas.height}`)
        // Calculate the canvas-space sizes of the padded text area and full text monitor
        const paddedWidth = this._textAreaSize.width;
        const paddedHeight = this._textAreaSize.height;
        // Resize the canvas to the correct screen-space size
        this._canvas.width = Math.ceil(this._size[0] * scale);
        this._canvas.height = Math.ceil(this._size[1] * scale);
        this._restyleCanvas();
        // Reset the transform before clearing to ensure 100% clearage
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        ctx.scale(scale, scale);
        ctx.translate(MonitorStyle.STROKE_WIDTH * 0.5, MonitorStyle.STROKE_WIDTH * 0.5);
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
        
                    // ctx.arcTo(0, paddedHeight, 0, paddedHeight - BubbleStyle.CORNER_RADIUS, BubbleStyle.CORNER_RADIUS);
                    // ctx.arcTo(0, 0, paddedWidth, 0, BubbleStyle.CORNER_RADIUS);
                    // ctx.arcTo(paddedWidth, 0, paddedWidth, paddedHeight, BubbleStyle.CORNER_RADIUS);
                    // ctx.arcTo(paddedWidth, paddedHeight, paddedWidth - BubbleStyle.CORNER_RADIUS, paddedHeight,
                    //     BubbleStyle.CORNER_RADIUS);

        // Translate the canvas so we don't have to do a bunch of width/height arithmetic
        ctx.save();
        ctx.translate(paddedWidth - MonitorStyle.CORNER_RADIUS, paddedHeight);
        ctx.restore();
        ctx.fillStyle = MonitorStyle.COLORS.FILL;
        ctx.strokeStyle = MonitorStyle.COLORS.STROKE;
        ctx.lineWidth = MonitorStyle.STROKE_WIDTH;
        ctx.stroke();
        ctx.fill();
        // Un-flip the canvas if it was flipped
        ctx.restore();
        // Draw each line of text
        ctx.fillStyle = MonitorStyle.COLORS.TEXT_FILL;
        ctx.font = `${MonitorStyle.FONT_SIZE}px ${MonitorStyle.FONT}, sans-serif`;
        const lines = this._lines;
        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            const line = lines[lineNumber];
            ctx.fillText(
                line,
                MonitorStyle.PADDING,
                MonitorStyle.PADDING + (MonitorStyle.LINE_HEIGHT * lineNumber) +
                    (MonitorStyle.FONT_HEIGHT_RATIO * MonitorStyle.FONT_SIZE)
            );
        }
        this._renderedScale = scale;
    }
}
module.exports = S3MonitorSkin;    
