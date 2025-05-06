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
.disableClick {
        pointer-events: none;
}
.enableClick {
    filter:brightness(1.2);
    transform:none;
}
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

.green-flag.is-active {
    background-color: $looks-transparent;
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
.green-flag_green-flag:hover {
    background-color: hsla(260, 60%, 60%, 0.15);
}
.green-flag_green-flag.running {
    background-color: hsla(260, 60%, 60%, 0.55);
    opacity: 0.5;
    filter:brightness(1.2);
    transform:none;
}
.green-flag_green-flag.not-running {
    opacity: 1.0;
}


.pause-button {
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
.stop-all_stop-all_pluqe:hover {
    background-color: hsla(260, 60%, 60%, 0.15);
}
.stop-all_stop-all_pluqe.is-not-active {
    opacity: 0.5;
    filter:brightness(1.2);
    transform:none;
}
.stop-all_stop-all_pluqe.is-active {
    opacity: 1.0;
}
.title-field {
    padding-left: 0.65rem;
    padding-top: 0.375rem;
    padding-right: 0.375rem;
    padding-bottom: 0.375rem;
    font-size: 0.8rem  
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
    background-color: #f0f0f0;
}
`,
    askCss : 
`
.stage_stage-overlays {
    position: absolute;
    top: 0.0625rem;
    left: 0.0625rem;
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: 9999;
}
.stage_stage-bottom-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
    width:100%;
    height:100%;
}
.stage_question-wrapper {
    width:100%;
    pointer-events: auto;
    z-index:99999;
}
.question_question-container {
    margin: 0.5rem;
    border: 1px solid hsla(0, 0%, 0%, 0.15);
    border-radius: 0.5rem;
    border-width: 2px;
    padding: 1rem;
    background: white;
}
.question_question-label {
    font-size: 0.75rem;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: hsla(225, 15%, 40%, 1);
    padding-bottom: 0.5rem;
}
.question_question-input {
    display: flex;
    position: relative;
    width:100%;
}
.question_question-input > input {
    padding: 0 2rem 0 .75rem;
    width:100%;
    font-weight: normal;
}
.question_question-input > input:focus {
    box-shadow: 0px 0px 0px 3px hsla(260, 60%, 60%, 0.35);
}
.input_input-form {
    height: 2rem;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1.2rem;
    color: hsla(225, 15%, 40%, 1);
    border-width: 1px;
    border-style: solid;
    border-color: hsla(0, 0%, 0%, 0.15);
    border-radius: 2rem;
    outline: none;
    cursor: text;
    transition: 0.25s ease-out;
    box-shadow: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    width:100%;
}
.input_input-form : hover {
    border-color : hsla( 260, 60%, 60%, 1);
}
.question_question-submit-button{
    position: absolute;
    top: calc(0.5rem / 2);
    right: calc(0.5rem /2);
    width: calc(2rem - 0.5rem);
    height: calc(2rem - 0.5rem);
    border: none;
    border-radius: 100%;
    color: white;
    background: hsla(260, 60%, 60%, 1);
}
.question_question-submit-button-icon {
    width: calc(2rem - 0.5rem);
    height: calc(2rem - 0.5rem);
    position: relative;
    right: -7px;
    left: -7px;
}    
    `


};
module.exports = CSS;