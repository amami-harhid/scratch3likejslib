const StageCanvasWrapperID = "stageCanvasWrapper";
const CanvasText2dId = "canvas-text2D";
const CanvasText2dClassName = "likeScratch-text-canvas";
const CanvasText2dZIndex = 90;
const CanvasMonitor2dClassName = 'likeScratch-monitor-canvas';
const CanvasMonitor2dZIndex = 100;
class Canvas {

    static canvas;
    static textCanvas;

    static CanvasMonitor2dClassName() {
        return CanvasMonitor2dClassName;
    }
    static StageCanvasWrapperID( ) {
        return StageCanvasWrapperID;
    }
    // static CanvasText2D ( ) {
    //     return CanvasText2D;
    // }
    static createCanvas( ) {
        if( Canvas.canvas ) {
            return Canvas.canvas;
        }
//        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();

        const canvasDiv = Canvas.getLikeScratchCanvas();

        let canvas = document.getElementById('canvas');
        if( canvas == undefined) {
            canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            canvasDiv.appendChild(canvas);
        }
        Canvas.canvas = canvas;
        Canvas.createTextCanvas( );
        return canvas;
    }
    static createTextCanvas( ){
        let canvasText2D = document.getElementById( CanvasText2dId );

        if( canvasText2D ) {
            return canvasText2D;
        }

//        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();
        const canvasDiv = Canvas.getLikeScratchCanvas();
        canvasText2D = document.createElement('canvas')
        canvasDiv.appendChild( canvasText2D )
        canvasText2D.id = CanvasText2dId;
        canvasText2D.className = CanvasText2dClassName;
        canvasText2D.style.position = 'absolute'
        canvasText2D.style.border = 'none';
        canvasText2D.style.zIndex = `${CanvasText2dZIndex}`;
    
        Canvas.textCanvas = canvasText2D;
        return canvasText2D;
    }
    
    static resize2DContext(width, height) {
        const textCanvas = Canvas.textCanvas;
        if(textCanvas != null){
            const _textCanvas = textCanvas;
            _textCanvas.style.left = '0px';
            _textCanvas.style.top = '0px';
            _textCanvas.width = width;
            _textCanvas.height = height;    
        }
    }
    static createMonitorCanvas() {
        const canvasArr = document.getElementsByClassName(CanvasMonitor2dClassName);
        if( canvasArr && canvasArr.length > 0){
            return canvasArr[0];
        }
        const canvasDiv = Canvas.getLikeScratchCanvas();
        const canvasMonitor2D = document.createElement('canvas')
        canvasMonitor2D.className = CanvasMonitor2dClassName;
        canvasMonitor2D.style.position = 'absolute'
        canvasMonitor2D.style.border = 'none';
        canvasMonitor2D.style.zIndex = `${CanvasMonitor2dZIndex}`;
        canvasMonitor2D.style.left = '0px';
        canvasMonitor2D.style.top = '0px';
        canvasDiv.appendChild( canvasMonitor2D );
        
        return canvasMonitor2D;
    }
    static resizeMonitorCanvas(width, height) {

        const canvasArr = document.getElementsByClassName(CanvasMonitor2dClassName);
        //console.log(`canvasArr.length=${canvasArr.length}`)
        for(const canvas of canvasArr){
            const _canvas = canvas;
            _canvas.width = width;
            _canvas.height = height;    
        }
    }

    static getStageCanvasWrapper() {
        let stageCanvasWrapper = document.getElementById( StageCanvasWrapperID );
        if( stageCanvasWrapper ) {
            return stageCanvasWrapper;
        }
        stageCanvasWrapper = document.createElement('div');
        stageCanvasWrapper.id = StageCanvasWrapperID;
        stageCanvasWrapper.classList.add(StageCanvasWrapperID)
        //stageCanvasWrapper.style.position = 'relative';
        const main = document.getElementById('main');
        if(main){
            main.appendChild(stageCanvasWrapper);
        }

        return stageCanvasWrapper;
    }

    static getLikeScratchCanvas() {
        let canvasDiv = document.getElementById('canvasDiv');
        if( canvasDiv ) {
            return canvasDiv;
        }
        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();
        canvasDiv = document.createElement('div');
        canvasDiv.classList.add('likeScratch-canvas');
        canvasDiv.id = 'canvasDiv';
        stageCanvasWrapper.appendChild(canvasDiv);
        return canvasDiv;

    }
};
module.exports = Canvas;