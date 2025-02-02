const interact = require('interactjs');
const Process = require('./process');
const Utils = require('./utils');

const Monitor = class {
    constructor(label, no=1, scale) {
        this._label = label;
        this.id = Utils.generateUUID();
        this.x = 0;
        this.y = 0;
        this.translateX = 0;
        this.translateY = 0;
        this._value = '';
        this.stageMonitorContainer = null;
        this.monitorLabel = null;
        this.monitorLabel = null;
        this.no = no
        this._scale = (scale==undefined)? 1 : scale;
        this._maxSize = 5;
        const target = this.init();
        target.setAttribute('scratch-scale', this._scale);
        this.interact(target, scale);
    }

    init() {
        const process = Process.default;
        const renderRate = process.renderRate;

        const getElementById = (id) => document.getElementById(id)
        const createElement = (node) => document.createElement(node); 
        const _stageCanvasWrapper = getElementById('stageCanvasWrapper');
    
        const uid = this.id;

        const stageMonitorContainer = createElement('div');
        this.stageMonitorContainer = stageMonitorContainer;
        stageMonitorContainer.classList.add('monitor_monitor-container');
        //stageMonitorContainer.classList.add('dragged-item');
        stageMonitorContainer.classList.add('dragTarget');
        stageMonitorContainer.id = `stageMonitorContainer_${uid}`
        stageMonitorContainer.setAttribute("style","touch-action: none;");
    
        _stageCanvasWrapper.appendChild(stageMonitorContainer);
    
        const defaultMonitor = createElement('div');
        defaultMonitor.id = `defaultMonitor_${uid}`;
        defaultMonitor.top = "100px";
        defaultMonitor.left = "100px";
        defaultMonitor.classList.add('monitor_default-monitor');
        stageMonitorContainer.appendChild(defaultMonitor);
        
        const monitorRaw = createElement('div');
        monitorRaw.id = `monitorRaw_${uid}`;
        monitorRaw.classList.add('monitor_row');
        defaultMonitor.appendChild(monitorRaw);
    
        const monitorLabel = createElement('div');
        monitorLabel.id = `monitorLabel_${uid}`;
        this.monitorLabel = monitorLabel;

        monitorLabel.classList.add('monitor_label');
        monitorRaw.appendChild(monitorLabel);
        monitorLabel.innerHTML  = `${this._label}`;

        const monitorValue = createElement('div');
        monitorValue.id = `monitorValue_${uid}`;
        this.monitorValue = monitorValue;

        monitorValue.classList.add('monitor_value');
        monitorRaw.appendChild(monitorValue);
        monitorValue.innerHTML  = '     '; // 初期値スペース５文字分
    
        const balloon = createElement('div');
        this.balloon = balloon;
        balloon.classList.add('monitor_balloon');
        balloon.innerHTML  = '---';
        stageMonitorContainer.appendChild(balloon);


        // canvas左上基準で位置決めする
        // すでに存在する Variable の表示をさけて表示させたい。
        // canvas のサイズ変更に合わせて top, left を変更したい。
        //const top = 0;
        //const left = 0;
        const scale = {x : this._scale / renderRate.x , y: this._scale / renderRate.y }
        stageMonitorContainer.style.top = 0; //`${top}px`;// (canvasClientRect.top+50) +"px";
        stageMonitorContainer.style.left = 0; //`${left}px` ;// (canvasClientRect.left+50) +"px";
        stageMonitorContainer.style.transform = `scale(${scale.x}, ${scale.y})`;

        const original_rect = stageMonitorContainer.getBoundingClientRect();

        const scratch_rect_size = process.toScratchPosition(original_rect.width, original_rect.height);

        this.original_rect = {width: scratch_rect_size.x, height: scratch_rect_size.y};
//        console.log(this.original_rect)
        return stageMonitorContainer;
    }
    interact(target , scale) {
        const me = this;
        const process = Process.default;
        const _scale = scale;
        interact(target).styleCursor(false)
        interact(target).draggable({
/* 
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                }),
            ],
*/

            listeners: {

                start(event) {
                  event.target.classList.add('dragging');
                },

                move(event) {
                    const renderRate = process.renderRate;
                    var target = event.target;

                    // 移動量 や位置を ScratchX, ScratchY に変換し
                    // data-x, data-y へ保存
                    // 使うときには、表示率を使って 実際の大きさへ直して使う！
                    // うまくうごかない！！
                    const scratchX = (parseFloat(target.getAttribute('scratch-x')) || 0);
                    const scratchY = (parseFloat(target.getAttribute('scratch-y')) || 0);
                    const actualPosition = process.toActualPosition(scratchX, scratchY);

                    actualPosition.x += event.dx;
                    actualPosition.y += event.dy;

                    const actualScaleX = target.getAttribute('actualScale-x') || null;        
                    const actualScaleY = target.getAttribute('actualScale-y') || null;
            
                    const adjustPosition = me._adjustPositionByScale(actualPosition.x, actualPosition.y, actualScaleX, actualScaleY);

                    target.style.left = `${adjustPosition.x}px`;
                    target.style.top = `${adjustPosition.y}px`;

                    const dScratchPosition = process.toScratchPosition(  actualPosition.x, actualPosition.y );
                    target.setAttribute('scratch-x', dScratchPosition.x);
                    target.setAttribute('scratch-y', dScratchPosition.y);

                    /* transform　Scale 変わらないので 設定不要だと思う。
                    const scale = me._scale; //(parseFloat(target.getAttribute('scratch-scale')) || 1);
                    const actualScale = {x: scale /  renderRate.x , y: scale / renderRate.y };

                    const scaleX = (parseFloat(target.getAttribute('scale-x')) || null);
                    const scaleY = (parseFloat(target.getAttribute('scale-y')) || null);
                    */
                    me._balloonHTML( target,  scratchX, scratchY );
                },

                end(event) {
                    event.target.classList.remove('dragging');
                    //console.log(`me.translateX= ${me.translateX}, me.translateY= ${me.translateX}`);

                }

            },
        })         

    }
    _balloonHTML( target, x, y) {
        const rect = target.getBoundingClientRect();
        const thisId = target.id;
        const balloon = document.querySelectorAll(`#${thisId} .monitor_balloon`);

        if( balloon && balloon.length>0) {
           
            const _balloon = balloon[0];
//            _balloon.innerHTML = `(${Math.ceil(x)}, ${Math.ceil(y)}, ${Math.ceil(rect.width)}, ${Math.ceil(rect.height)})`;
            _balloon.innerHTML = `(${Math.ceil(x)} , ${Math.ceil(y)} )`;
        }

    }

    hide() {
        this.stageMonitorContainer.style.display = 'none';
    }
    show() {
        this.stageMonitorContainer.style.display = '';
    }
    get size() {
        const rect = this.stageMonitorContainer.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        return {w:w, h:h};
    }
    setPosition( position) {
        this.x = position.x;
        this.y = position.y;
        const target = this.stageMonitorContainer;
        target.setAttribute('scratch-x', this.x)
        target.setAttribute('scratch-y', this.y)
        this._balloonHTML( target, this.x, this.y);
        this.resize();
    }
    resize( ) {
        const target = this.stageMonitorContainer;
        const process = Process.default;
        const renderRate = process.getRenderRate();

        const dataX = parseFloat(target.getAttribute('scratch-x')) || 0;
        const dataY = parseFloat(target.getAttribute('scratch-y')) || 0;
  
        const dActualPosition = process.toActualPosition(dataX, dataY);
        

        const scaleX = this._scale / renderRate.x;
        const scaleY = this._scale / renderRate.y;

        target.setAttribute('actualScale-x', scaleX)        
        target.setAttribute('actualScale-y', scaleY)        

        const original_rect = this.original_rect;
        const scaled_rect = {width: original_rect.width * scaleX, height: original_rect.height * scaleY };
        const d = {x: (scaled_rect.width - original_rect.width) /2, y: (scaled_rect.height - original_rect.height) /2 }
        const adjustPosition = this._adjustPositionByScale(dActualPosition.x, dActualPosition.y, scaleX, scaleY);
        target.style.left = `${adjustPosition.x}px`;// (canvasClientRect.top+50) +"px";
        target.style.top = `${adjustPosition.y}px` ;// (canvasClientRect.left+50) +"px";
        target.style.transform = `scale(${scaleX}, ${scaleY})`;
    }

    _adjustPositionByScale(x, y, scaleX, scaleY) {

        const original_rect = this.original_rect;
        const scaled_rect = {width: original_rect.width * scaleX, height: original_rect.height * scaleY };
        const d = {x: (scaled_rect.width - original_rect.width) /2, y: (scaled_rect.height - original_rect.height) /2 }

        return {x: x + d.x, y: y + d.y};

    }

    set balloonText ( text ) {
        this.balloon.innerHTML = text;
    }
    set label (_label) {
        this._label = _label;
        this.monitorLabel.innerHTML = `${this._label}`;
    }
    set maxSize (maxSize) {
        this._maxSize =  maxSize;
    }
    get value( ) {
        return this._value;
    }
    set value(value) {
        this._value = value;
        const _maxSize = this._maxSize;
        if(Utils.isNumber(this._value)) {
            const str = String(this._value);
            this.monitorValue.innerHTML = str.padStart(_maxSize, ' ');
        }else{
            this.monitorValue.innerHTML = this._value.padEnd(_maxSize, ' ');
        }
    }
}

module.exports = Monitor;