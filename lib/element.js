const Canvas = require('./canvas');
const CSS = require('./css');
const Env = require('./env');
const Process = require('./process');
const Utils = require('./utils');
const Element = class {
    static get DISPLAY_NONE () {
        return "displayNone";
    }
    static createMain (zIndex) {
        let main = document.getElementById('main');
        if(main == undefined) {
            main = document.createElement('main');
            main.id = 'main';
            document.body.appendChild(main);
        }
        main.style.zIndex = zIndex
        main.style.position = 'absolute'
        main.style.touchAction = 'manipulation'
//        Element.main = main;
        Process.default.main = main;
        Element.mainPositioning(main);    
        return main
    }
    static mainPositioning(main=Element.main) {
        main.style.width = `${innerWidth}px`
        main.style.height = `${innerHeight}px`
    }
    static createCanvas( ) {
        const canvas = Canvas.createCanvas( );
        canvas.classList.add("likeScratch-canvas");
        Element.canvas = canvas;
        Process.default.canvas = canvas;
        //canvas.getContext('2d', { willReadFrequently: true });
        return canvas;
    }
    static createTextCanvas(main) {
        const canvas = Canvas.createTextCanvas(main);
        canvas.classList.add("likeScratch-text-canvas");
        Element.textCanvas = canvas;
        Process.default.textCanvas = canvas;
        return canvas;
    }
    static createFlag (main) {
        if (Element.flag) {
            return Element.flag;
        }
        let flag = document.getElementById('start-flag');
        if( flag ) {
            main.removeChild(flag);
        }
        flag = document.createElement('div');
        flag.id = 'start-flag';
        flag.className = 'likeScratch-flag';
        main.appendChild(flag);
        //Element.flag = flag;
        Process.default.flag = flag;
        Element.flagPositioning(flag);
        // looks
        flag.style.position = 'absolute';
        flag.innerHTML = '&#9873;'; // 旗マーク
  
        return flag;
    }
    static flagPositioning(flag = Element.flag) {
        const flagSize = 130;
        // Convert the center based x coordinate to a left based one.
        const x = -(flagSize / 2);
        // Convert the center based y coordinate to a left based one.
        const y = -(flagSize / 2)  ;
        // looks
        flag.style.width = `${flagSize}px`;
        flag.style.height = `${flagSize}px`;
        flag.style.left = `${(innerWidth / 2) + x}px`;
        flag.style.top = `${(innerHeight / 2) + y}px`;

    }
    static insertCss() {
        const style = document.createElement('style');
        style.innerHTML = `
            ${CSS.documentCss}\n\n
            ${CSS.flagCss}\n\n
            ${CSS.canvasCss}\n\n
            ${CSS.mainTmpCss}\n\n
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    static async init() {
        const process = Process.default;
        const main = Element.createMain(999);
        // text Canvas
        //Element.createTextCanvas(main);
        // normal Canvas
        Element.createCanvas( );
        const flag = Element.createFlag(main);
        flag.addEventListener('click', async function() {
            //flag.remove();
            //最初は消していたが、将来、再開ボタンとして表示するかもしれず、非表示にするだけとする。
            flag.classList.add(Element.DISPLAY_NONE);
            process._drawingStart();
        });
    }
}

module.exports = Element;
