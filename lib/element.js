const Canvas = require('./canvas');
const CSS = require('./css');
//const Env = require('./env');
const Process = require('./process');
//const Utils = require('./utils');
const ControlGreenFlag = "green-flag_green-flag";
const ControlStopMark = "stop-all_stop-all_pluqe";
const GreenFlag = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNi42MyAxNy41Ij48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtMntmaWxsOiM0Y2JmNTY7c3Ryb2tlOiM0NTk5M2Q7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30uY2xzLTJ7c3Ryb2tlLXdpZHRoOjEuNXB4O308L3N0eWxlPjwvZGVmcz48dGl0bGU+aWNvbi0tZ3JlZW4tZmxhZzwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNLjc1LDJBNi40NCw2LjQ0LDAsMCwxLDguNDQsMmgwYTYuNDQsNi40NCwwLDAsMCw3LjY5LDBWMTIuNGE2LjQ0LDYuNDQsMCwwLDEtNy42OSwwaDBhNi40NCw2LjQ0LDAsMCwwLTcuNjksMCIvPjxsaW5lIGNsYXNzPSJjbHMtMiIgeDE9IjAuNzUiIHkxPSIxNi43NSIgeDI9IjAuNzUiIHkyPSIwLjc1Ii8+PC9zdmc+";
const StopMark = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNCAxNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTQgMTQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRUM1OTU5O3N0cm9rZTojQjg0ODQ4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+Cjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iNC4zLDAuNSA5LjcsMC41IDEzLjUsNC4zIDEzLjUsOS43IDkuNywxMy41IDQuMywxMy41IDAuNSw5LjcgMC41LDQuMyAiLz4KPC9zdmc+Cg==";
const Element = class {
    static get DISPLAY_NONE () {
        return "displayNone";
    }
    static getControlGreenFlag(){
        let element = document.getElementById(ControlGreenFlag);
        return element;
    }
    static getControlStopMark(){
        let element = document.getElementById(ControlStopMark);
        return element;
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
        
        let header = document.createElement("div");
        header.id="scratch-header";
        header.classList.add("scratch3Header");
        main.appendChild(header);
        let headerMenu = document.createElement("div");
        headerMenu.classList.add("scratch3HeaderMenu");
        header.appendChild(headerMenu);
        let menuControl = document.createElement("div");
        menuControl.classList.add("controls_controls-container");
        headerMenu.appendChild(menuControl);
        let imgGreenFlag = document.createElement("img");
        imgGreenFlag.id = ControlGreenFlag;
        imgGreenFlag.classList.add(ControlGreenFlag);
        imgGreenFlag.setAttribute("src", GreenFlag);
        imgGreenFlag.setAttribute("draggable","false");
        imgGreenFlag.setAttribute("title", "実行");
        menuControl.appendChild(imgGreenFlag);
        let imgStopMark = document.createElement("img");
        imgStopMark.id = ControlStopMark;
        imgStopMark.classList.add(ControlStopMark);
        imgStopMark.setAttribute("src", StopMark);
        imgStopMark.setAttribute("draggable","false");
        imgStopMark.setAttribute("title", "止める");
        menuControl.appendChild(imgStopMark);



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
            ${CSS.scratch3Header}\n\n
            ${CSS.canvasCss}\n\n
            ${CSS.textCanvasCss}\n\n
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
        flag.addEventListener('click', async function(e) {
            //flag.remove();
            //最初は消していたが、将来、再開ボタンとして表示するかもしれず、非表示にするだけとする。
            flag.classList.add(Element.DISPLAY_NONE);
            process._drawingStart();
            e.stopPropagation();
        });
        const controlGreenFlag = Element.getControlGreenFlag();
        controlGreenFlag.addEventListener('click', async function(e){
            flag.classList.add(Element.DISPLAY_NONE);
            // 初期化なんだけど。どするの？
            e.stopPropagation();
        });
    }
}

module.exports = Element;
