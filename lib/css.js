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
  }
`,
    canvasCss : `
.likeScratch-canvas {
        display: block;
        border: 5px solid #444444;
        border-radius: 20px;
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