const CSS = {
    documentCss : `
* { 
        box-sizing: border-box;
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-touch-callout:none;                /* prevent callout to copy image, etc when tap to hold */
        -webkit-tap-highlight-color:rgba(0,0,0,0); /* prevent tap highlight color / shadow */
  }
html, body{
        margin:0;
        padding:0;
        width:100%;
        height:100%;
        overflow-x: hidden;
        overflow-y: hidden;
  }
.displayNone {
        display:none;
  }
`,
    flagCss : `
#start-flag{
        z-index:2147483647;
  }
.likeScratch-flag {
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 75px;
        line-height: 65px;
        padding: 32px;
        color: #005e00;
        background: #2eff2e;
        border: 2px solid #007900;
        border-radius: 65px;
        cursor: pointer;
  }
#main {
        position: absolute;
        width:100%;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #e0ffff;
  }
`,
    scratch3Header : `
.scratch3Header {
        position: fixed;
        background-color: rgb(232, 237, 241);
        top: 0;
        left: 0;
        right: 0;
        z-index: 5000;
        width: 100%;
  }
.scratch3HeaderMenu {
    display: flex;
    margin: auto;
    justify-content: space-between;
    flex-shrink: 0;
    align-items: center;
    height: 2.0rem;
    padding-top: 0;
    padding-bottom: 0;
}
.controls_controls-container {
    display: flex;
}
.green-flag_green-flag {
    width: 2rem;
    height: 2rem;
    padding: 0.375rem;
    border-radius: 0.25rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    user-drag: none;
    cursor: pointer;
}
.stop-all_stop-all_pluqe {
    width: 2rem;
    height: 2rem;
    padding: 0.375rem;
    border-radius: 0.25rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
}
`,
    canvasCss : `
.stageCanvasWrapper {
    position: fixed;
    top: 2rem;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5000;
    background-color: hsla(0, 100%, 100%, 1);
    padding: 0.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.likeScratch-canvas {
        display: block;
        border: 1px solid #141414;
        border-radius: 15px;
  }  
`,
    textCanvasCss : `
.likeScratch-text-canvas {
        pointer-events: none;
  }
`,
    mainTmpCss : `
.nowLoading {
      background-image: url(https://amami-harhid.github.io/scratch3LikeJs/web/assets/NowLoading.svg);
      background-repeat: no-repeat;
      background-position: center;
}
`


};


module.exports = CSS;