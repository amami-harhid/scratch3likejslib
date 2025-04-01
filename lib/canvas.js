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
    static createTextCanvas( ) {
        let canvasText2D = document.getElementById( CanvasText2dId );

        if( canvasText2D ) {
            return;
        }

//        const stageCanvasWrapper = Canvas.getStageCanvasWrapper();
        const canvasDiv = Canvas.getLikeScratchCanvas();
        canvasText2D = document.createElement('canvas')
        canvasDiv.appendChild( canvasText2D )
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
        stageCanvasWrapper.classList.add(StageCanvasWrapperID)
        //stageCanvasWrapper.style.position = 'relative';
        main.appendChild(stageCanvasWrapper);

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
}

module.exports = Canvas;