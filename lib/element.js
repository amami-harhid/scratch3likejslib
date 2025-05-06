const Canvas = require('./canvas');
const CSS = require('./css');
const QuestionBoxElement = require('./io/questionBoxElement');
const threads = require('./threads');
const ScratchHeader = "scratch3Header";
const ControlGreenFlag = "green-flag_green-flag";
const ControlStopMark = "stop-all_stop-all_pluqe";
const ControlPauseMark = "pause-button";
const GreenFlag = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNi42MyAxNy41Ij48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtMntmaWxsOiM0Y2JmNTY7c3Ryb2tlOiM0NTk5M2Q7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30uY2xzLTJ7c3Ryb2tlLXdpZHRoOjEuNXB4O308L3N0eWxlPjwvZGVmcz48dGl0bGU+aWNvbi0tZ3JlZW4tZmxhZzwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNLjc1LDJBNi40NCw2LjQ0LDAsMCwxLDguNDQsMmgwYTYuNDQsNi40NCwwLDAsMCw3LjY5LDBWMTIuNGE2LjQ0LDYuNDQsMCwwLDEtNy42OSwwaDBhNi40NCw2LjQ0LDAsMCwwLTcuNjksMCIvPjxsaW5lIGNsYXNzPSJjbHMtMiIgeDE9IjAuNzUiIHkxPSIxNi43NSIgeDI9IjAuNzUiIHkyPSIwLjc1Ii8+PC9zdmc+";
const StopMark = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNCAxNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTQgMTQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRUM1OTU5O3N0cm9rZTojQjg0ODQ4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+Cjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iNC4zLDAuNSA5LjcsMC41IDEzLjUsNC4zIDEzLjUsOS43IDkuNywxMy41IDQuMywxMy41IDAuNSw5LjcgMC41LDQuMyAiLz4KPC9zdmc+Cg==";
const PauseMark = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTgiIHdpZHRoPSIxOCI+PHBhdGggZD0iTTIzMS40MjkgMTg4LjkyOVYxNzEuMDdoNC4yODV2MTcuODU4em0xMi4xNDIgMFYxNzEuMDdoNC4yODZ2MTcuODU4eiIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMzMwOSAwIDAgLjk1NDI3IC0yMzguNTczIC0xNjIuNzY5KSIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSIjZmZhZTAwIiBzdHJva2U9IiNkODk0MDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOm5vcm1hbCIvPjwvc3ZnPg==";
const RestartMark = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTgiIHdpZHRoPSIxOCI+PHBhdGggZD0ibTI0Ni4wNTUgMTgwLTEyLjExIDEyLjExdi0yNC4yMnoiIHRyYW5zZm9ybT0ibWF0cml4KDEuMTM5NDkgMCAwIC42Nzk0MyAtMjY0LjU5NSAtMTEzLjI5OCkiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlPSIjZDg5NDAwIiBmaWxsPSIjZmZhZTAwIiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iLz48L3N2Zz4=";

const ReloadMark = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJfeDMxXzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9IndpZHRoOiAxNnB4OyBoZWlnaHQ6IDE2cHg7IG9wYWNpdHk6IDE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4gPHN0eWxlIHR5cGU9InRleHQvY3NzIj4gCS5zdDB7ZmlsbDojMzc0MTQ5O30gPC9zdHlsZT4gPGc+IAk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzg4LjQ4NiwyOTguMDg3bC0wLjA4Mi0wLjAyN2wwLDBsLTAuMTUyLTAuMDQ2Yy0yLjcxNSw4LjU3NC02LjIxMSwxNi43MDItMTAuMzc0LDI0LjM1IAkJYy0wLjEwNiwwLjE4Ny0wLjIxMSwwLjM3NS0wLjMxNywwLjU2MmMtMS44MTYsMy4yOTctMy43OTMsNi40NzYtNS44NTUsOS41ODZjLTAuNDk2LDAuNzQyLTAuOTgsMS40OTItMS40ODgsMi4yMjIgCQljLTEuNzE5LDIuNDg0LTMuNTUsNC44NjctNS40MTQsNy4yMjJjLTAuNzk4LDAuOTkyLTEuNTU1LDIuMDIzLTIuMzc1LDIuOTk2Yy0xLjcxMSwyLjAzNS0zLjUyNywzLjk1Ny01LjM0LDUuODgyIAkJYy0yLjIwNiwyLjMzMi00LjQ4OCw0LjU3NC02Ljg0Myw2Ljc0NmMtMS4zODIsMS4yNzgtMi43MjYsMi41OS00LjE1NiwzLjgwNWMtMS42NjQsMS40MTgtMy40MTQsMi43My01LjE0LDQuMDcgCQljLTEuNDEsMS4wOS0yLjgwOSwyLjE5NS00LjI1OCwzLjIzYy0xLjY0MSwxLjE3Ni0zLjMzMiwyLjI4Mi01LjAyMywzLjM4N2MtMS43NDYsMS4xMzMtMy41MDQsMi4yNDYtNS4yOTcsMy4zMDQgCQljLTEuNDY5LDAuODcxLTIuOTU3LDEuNzE1LTQuNDU3LDIuNTMxYy0yLjM2NywxLjI4Mi00Ljc3NCwyLjQ5Mi03LjIxNCwzLjYzN2MtMS4wMTIsMC40OC0yLjAyLDAuOTc3LTMuMDQzLDEuNDM0IAkJYy0yNi45OTgsMTEuODctNTcuODc2LDE1LjMyNy04OC40MjIsNy45MDZjLTM2Ljc1Ni04LjkyOS02Ny41MjEtMzIuMTk4LTg2LjMyOC02My43MmMtMy40MTgtNS43NS02LjQ3Ny0xMS43NDUtOS4wNS0xOC4wMTggCQlsMjUuNTQ2LTEuNTg2bDE4LjA4OS0xLjAxNmwtMC4xMTctMC4xMDZsMC4yMjYtMC4wMTFsLTkwLjczOC04MC4wOWwtMC4yNjItMC4yMzR2MC4wMDRMODAuNDgxLDIyNmwtNDYuODg5LDUzLjA4NEwwLDMxNi45MzggCQlsMC4xNjQtMC4wMTJsLTAuMTUyLDAuMTcybDQ2LjYxNC0yLjg5OGMyMS4xMzYsNzUuOTQ2LDgxLjI5LDEzNC40MjcsMTU4LjA0OCwxNTMuMDc5YzE3LjA0Niw0LjE0LDM0LjE1NCw2LjEyNSw1MS4wMzcsNi4xMjUgCQljOTEuNzU0LDAsMTc2LjU5Ny01OC43MTYsMjA2LjQ4Ni0xNDguODk2YzAuMjk3LTAuODg2LDAuNjc2LTEuNzM0LDAuOTYxLTIuNjI5aC0wLjAwOGMwLjAxNi0wLjA1LDAuMDM5LTAuMTAyLDAuMDU1LTAuMTUyIAkJTDM4OC40ODYsMjk4LjA4N3oiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAwLCAwKTsiPjwvcGF0aD4gCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMjMuMzc3LDIxMy44NjRsMC4yMjMsMC4wN2wwLDBsMC4xNTIsMC4wNDdjMi43MTUtOC41NzgsNi4yMTEtMTYuNzEsMTAuMzc4LTI0LjM1OCAJCWMwLjA5OC0wLjE4LDAuMjAzLTAuMzU2LDAuMzAxLTAuNTM1YzEuODItMy4zMDksMy44MDUtNi40OTYsNS44NzEtOS42MTdjMC40OTItMC43MzQsMC45NzItMS40NzcsMS40OC0yLjE5OSAJCWMxLjcyMi0yLjQ5MiwzLjU1OC00Ljg4Niw1LjQzLTcuMjQ2YzAuNzkzLTAuOTkyLDEuNTQzLTIuMDEyLDIuMzU5LTIuOTc3YzEuNzE1LTIuMDQ2LDMuNTM5LTMuOTc2LDUuMzY3LTUuOTE0IAkJYzIuMTcxLTIuMjk3LDQuNDI2LTQuNTExLDYuNzQ2LTYuNjU2YzEuNDA2LTEuMzAxLDIuNzgxLTIuNjM3LDQuMjM4LTMuODc0YzEuNjUyLTEuNDA2LDMuMzg2LTIuNzExLDUuMTA1LTQuMDM5IAkJYzEuNDIyLTEuMTAyLDIuODMyLTIuMjE4LDQuMjk3LTMuMjY2YzEuNjMzLTEuMTY4LDMuMzEyLTIuMjY2LDQuOTk2LTMuMzYzYzEuNzU0LTEuMTQ0LDMuNTE5LTIuMjYyLDUuMzI0LTMuMzI0IAkJYzEuNDY1LTAuODY3LDIuOTQxLTEuNzA3LDQuNDM3LTIuNTE5YzIuMzc1LTEuMjg2LDQuNzg5LTIuNTA0LDcuMjM0LTMuNjUyYzEuMDA4LTAuNDczLDIuMDA0LTAuOTY5LDMuMDIzLTEuNDE4IAkJYzI3LjAwMi0xMS44NzgsNTcuODgtMTUuMzM1LDg4LjQzLTcuOTFjMzYuNzIxLDguOTIyLDY3LjQ2NiwzMi4xNTUsODYuMjc4LDYzLjYzOGMzLjQzNyw1Ljc3NCw2LjUxMSwxMS43OTcsOS4wOTcsMTguMDk3IAkJbC0yNS41MywxLjU5bC0xOC4xMDUsMS4wMTJsMC4xMjEsMC4xMDZsLTAuMjI2LDAuMDE1bDkxLjExNyw4MC40MjZsNDcuMjY3LTUzLjUxTDUxMiwxOTUuMDU2bC0wLjE2LDAuMDEybDAuMTQ4LTAuMTY4IAkJbC00Ni42MTQsMi44OThDNDQ0LjIzOCwxMjEuODUzLDM4NC4wODgsNjMuMzY4LDMwNy4zMyw0NC43MkMyMDIuNTU0LDE5LjI2NCw5NS4xODMsNzUuMjkyLDU0Ljk0NiwxNzMuNDU2IAkJYy0wLjEwOSwwLjI2Ni0wLjIxLDAuNTM5LTAuMzIsMC44MDVjLTIuMDc0LDUuMTE3LTQuMDExLDEwLjMxOS01LjcxLDE1LjY1OWMtMC4wMiwwLjA2Ni0wLjA1MSwwLjEyOS0wLjA3LDAuMTk1bDAuMDA0LDAuMDA0IAkJYy0wLjAxNiwwLjA1LTAuMDM1LDAuMDk4LTAuMDUxLDAuMTQ4TDEyMy4zNzcsMjEzLjg2NHoiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAwLCAwKTsiPjwvcGF0aD4gPC9nPiA8L3N2Zz4=";

const playGround = require('./playGround');

class Element {

    static main;
    static canvas;
    static textCanvas;

    static get DISPLAY_NONE () {
        return "displayNone";
    }
    static getControlGreenFlag() {
        const element = document.getElementById(ControlGreenFlag);
        if(element){
            return element;
        }
        throw `NOT FOUND Element (id=${ControlGreenFlag})`;
    }
    static getControlStopMark() {
        let element = document.getElementById(ControlStopMark);
        if(element){
            return element;
        }
        throw `NOT FOUND Element (id=${ControlStopMark})`;
    }
    
    static createMain (zIndex) {
        const p = playGround.default;
        let main = document.getElementById('main');
        if(main == undefined) {
            main = document.createElement('main');
            main.id = 'main';
            document.body.appendChild(main);
        }
        main.style.zIndex = `${zIndex}`;
        main.style.position = 'absolute';
        main.style.touchAction = 'manipulation';
        p.main = main;
        
        const header = document.createElement("div");
        header.id=ScratchHeader;
        header.classList.add(ScratchHeader);
        main.appendChild(header);
        const headerMenu = document.createElement("div");
        headerMenu.classList.add("scratch3HeaderMenu");
        header.appendChild(headerMenu);
        const menuControl = document.createElement("div");
        menuControl.classList.add("controls_controls-container");
        headerMenu.appendChild(menuControl);
        const imgGreenFlag = document.createElement("img");
        imgGreenFlag.id = ControlGreenFlag;
        imgGreenFlag.classList.add(ControlGreenFlag);
        Element.changeToGreenFlag(imgGreenFlag);
        imgGreenFlag.setAttribute("draggable","false");
        menuControl.appendChild(imgGreenFlag);


        const pauseMark = document.createElement('img');
        pauseMark.id = ControlPauseMark;
        pauseMark.classList.add(ControlPauseMark);
        pauseMark.setAttribute("draggable","false");
        Element.changeToPauseMark(pauseMark);
        menuControl.appendChild(pauseMark);

        const imgStopMark = document.createElement("img");
        imgStopMark.id = ControlStopMark;
        imgStopMark.classList.add(ControlStopMark);
        imgStopMark.setAttribute("src", StopMark);
        imgStopMark.setAttribute("draggable","false");
        imgStopMark.setAttribute("title", "止める");
        menuControl.appendChild(imgStopMark);

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('title-field');
        titleSpan.innerText = document.title;
        menuControl.appendChild(titleSpan);

        Element.mainPositioning(main);
        return main
    }
    static changeToReloadMark(imgGreenFlag){
        //ReloadMark
        imgGreenFlag.setAttribute('src', ReloadMark)
        imgGreenFlag.setAttribute('title', "リロード");
        imgGreenFlag.style.padding = "0.2rem";
    }
    static changeToGreenFlag(imgGreenFlag){
        //ReloadMark
        imgGreenFlag.setAttribute('src', GreenFlag)
        imgGreenFlag.setAttribute('title', "実行");
        imgGreenFlag.style.padding = "0.375rem"
    }
    static changeToPauseMark(pauseMark){
        pauseMark.setAttribute("src", PauseMark);
        pauseMark.setAttribute("title", "一時停止");
    }
    static changeToRestartMark(pauseMark){
        pauseMark.setAttribute("src", RestartMark);
        pauseMark.setAttribute("title", "再開");
    }
    static mainPositioning(main=Element.main) {
        const scratchHeader = document.getElementById(ScratchHeader);
        main.style.width = `${window.innerWidth}px`;
        main.style.height = `${window.innerHeight}px`;
        //main.style.height = `${window.innerHeight - scratchHeader.innerHeight}px`;
    }
    static createCanvas( ) {
        const p = playGround.default;
        const canvas = Canvas.createCanvas( );
        canvas.classList.add("likeScratch-canvas");
        Element.canvas = canvas;
        p.canvas = canvas;
        //canvas.getContext('2d', { willReadFrequently: true });
        return canvas;
    }
    static createTextCanvas(main) {
        const canvas = Canvas.createTextCanvas();
        canvas.classList.add("likeScratch-text-canvas");
        Element.textCanvas = canvas;
        playGround.default.textCanvas = canvas;
        return canvas;
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
            ${CSS.askCss}\n\n
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    static async flagInit() {
        const controlGreenFlag = Element.getControlGreenFlag();
        const controlPauseMark = Element.getElementById(ControlPauseMark);
        const controlStopMark = Element.getControlStopMark();
        const me = this;
        let greenFlagClicked = false;
        controlGreenFlag.classList.remove('disableClick');
        controlGreenFlag.classList.add('enableClick');
        controlGreenFlag.classList.add('not-running');
        controlGreenFlag.classList.remove('running');
        controlStopMark.classList.remove('enableClick');
        controlStopMark.classList.add('disableClick');
        controlStopMark.classList.add('is-not-active');
        controlStopMark.classList.remove('is-active');
        controlGreenFlag.addEventListener('click', async function(e){
            e.stopPropagation();
            controlGreenFlag.classList.remove('enableClick');
            controlGreenFlag.classList.add('disableClick');
            controlGreenFlag.classList.remove('not-running');
            controlGreenFlag.classList.add('running');
            controlStopMark.classList.remove('disableClick');
            controlStopMark.classList.add('enableClick');
            controlStopMark.classList.remove('is-not-active');
            controlStopMark.classList.add('is-active');
            playGround.default.threads.startAll();
            greenFlagClicked = true;
//            Element.changeToReloadMark(controlGreenFlag);
            playGround.default.runtime.emit('RUNNING_GAME'); // ON は processの中にある
        });
        //flag.classList.add(Element.DISPLAY_NONE);

        controlPauseMark.classList.add(Element.DISPLAY_NONE)
        let restartMarkFlag = false;
        controlPauseMark.addEventListener('click', async function(e){
            e.stopPropagation();
            if(restartMarkFlag){
                if(greenFlagClicked===true) {
                    playGround.default.threads.startAll();
                    playGround.default.runtime.emit('RUNNING_GAME'); // ON は processの中にある
                }
                Element.changeToPauseMark(controlPauseMark);
                restartMarkFlag = false;
            }else{
                if(greenFlagClicked===true) {
                    threads.pauseThreadsInterval();//一時停止
                    playGround.default.runtime.emit('PAUSING_GAME'); // ON は processの中にある
                }
                Element.changeToRestartMark(controlPauseMark);
                restartMarkFlag = true;
            }
        });

        controlStopMark.addEventListener('click', async function(e){
            e.stopPropagation();
            controlStopMark.classList.remove('enableClick');
            controlStopMark.classList.add('disableClick');
            controlStopMark.classList.add('is-not-active');
            controlStopMark.classList.remove('is-active');
            controlGreenFlag.classList.remove('disableClick');
            controlGreenFlag.classList.add('enableClick');
            controlGreenFlag.classList.add('not-running');
            controlGreenFlag.classList.remove('running');
            //process._init();
            Element.stopAll();
        });
        const runtime = playGround.default.runtime;
        const EmitID_GREEN_BUTTON_ENABLED = runtime.GREEN_BUTTON_ENABLED;
        runtime.on(EmitID_GREEN_BUTTON_ENABLED, function(){
            controlStopMark.classList.remove('enableClick');
            // 自動停止したときは停止ボタンはクリック可能、２回目はクリックできない。
            //controlStopMark.classList.add('disableClick'); 
            controlStopMark.classList.add('is-not-active');
            controlStopMark.classList.remove('is-active');
            controlGreenFlag.classList.remove('disableClick');
            controlGreenFlag.classList.add('enableClick');
            controlGreenFlag.classList.add('not-running');
            controlGreenFlag.classList.remove('running');
        });
    }
    static stopAll() {
        // thread loop 停止
        threads.stopThreadsInterval();            
        // スプライトのクローンを削除
        if(playGround.default.stage.sprites){
            for(const s of playGround.default.stage.sprites){
                if(s && s.clones){
                    for(const c of s.clones){
                        if(c && c.isAlive()){
                            c.$remove();
                        }
                    }    
                }
            }
            // Sprite-QuestionBox を消す
            for(const s of playGround.default.stage.sprites){
                QuestionBoxElement.removeAsk(s);
            }
        }
        // Stage-QuestionBox を消す
        // QuestionBoxElement.default.removeAsk(playground.stage);
        playGround.default.stage.emit(QuestionBoxElement.QuestionBoxForceComplete);        
            
        playGround.default._draw();
        playGround.default.runtime.emit('PAUSING_GAME'); // ON は processの中にある
        
    }
    static getElementById(id) {
        const element = document.getElementById(id);
        if(element){
            return element;
        }
        throw `Not found element id=${id}`;
    }
    static async init() {
        const main = Element.createMain(999);
        Element.createCanvas( );
        // text Canvas
        //Element.createTextCanvas(main);
        // normal Canvas
        return main;
    }

};
module.exports = Element;