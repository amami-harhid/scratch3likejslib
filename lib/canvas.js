const StageCanvasWrapperID = "stageCanvasWrapper";
const CanvasText2dId = "canvas-text2D";
const CanvasText2dClassName = "likeScratch-text-canvas";
const CanvasText2dZIndex = 90;

const Canvas = class{
    static StageCanvasWrapperID( ) {
        return StageCanvasWrapperID;
    }
    static CanvasText2D ( ) {
        return CanvasText2D;
    }
    static createCanvas( ) {
        if( Canvas.canvas ) {
            return;
        }
        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();
        let canvas = document.getElementById('canvas');
        if( canvas == undefined) {
            canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            stageCanvasWrapper.appendChild(canvas);
        }
        Canvas.canvas = canvas;
        Canvas.createTextCanvas( );
        return canvas;
    }
    static createTextCanvas( ) {
        let canvasText2D = document.getElementById( CanvasText2dId );

        if( canvasText2D ) {
            return;
        }

        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();
        canvasText2D = document.createElement('canvas')
        stageCanvasWrapper.appendChild( canvasText2D )
        canvasText2D.id = CanvasText2dId;
        canvasText2D.className = CanvasText2dClassName;
        canvasText2D.style.position = 'absolute'
        canvasText2D.style.border = 'none';
        canvasText2D.style.zIndex = CanvasText2dZIndex
    
        Canvas.textCanvas = canvasText2D;
        return canvasText2D;
    }
    
    static resize2DContext(width, height) {
        const textCanvas = Canvas.textCanvas;
        textCanvas.style.left = '0px';
        textCanvas.style.top = '0px';
        textCanvas.width = width;
        textCanvas.height = height;
    }
    

    static getStageCanvasWrapper() {
        let stageCanvasWrapper = document.getElementById( StageCanvasWrapperID );
        if( stageCanvasWrapper ) {
            return stageCanvasWrapper;
        }
        stageCanvasWrapper = document.createElement('div');
        stageCanvasWrapper.id = StageCanvasWrapperID;
        stageCanvasWrapper.style.position = 'relative';
        main.appendChild(stageCanvasWrapper);

        return stageCanvasWrapper;
    }
}

module.exports = Canvas;