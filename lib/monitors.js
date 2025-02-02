const Process = require('./process');
const Monitor = require('./monitor');

const CSS = {
monitar_container :`
.monitor_monitor-container {
    position: absolute;
    background: hsla(255, 100%, 100%, 100);
    z-index: 999;
    border: 1px solid hsla(0, 0%, 0%, 0.15);
    border-radius: calc(0.5rem / 2);
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.75rem;
    -webkit-transition: -webkit-box-shadow 0.2s;
    transition: -webkit-box-shadow 0.2s;
    -o-transition: box-shadow 0.2s;
    transition: box-shadow 0.2s;
    transition: box-shadow 0.2s, -webkit-box-shadow 0.2s;
    pointer-events: all;
    overflow: hidden;
}
.monitor_default-monitor {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    padding: 3px;
}
.monitor_row {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
}
.monitor_label {
    font-weight: bold;
    text-align: center;
    margin: 0 5px;
}
.monitor_value {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    min-width: 40px;
    text-align: center;
    margin: 0 5px;
    border-radius: calc(0.5rem / 2);
    padding: 0 2px;
    white-space: pre-wrap;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    background: rgb(255, 140, 26); 
    color: rgb(255, 255, 255);
}
.dragTarget {
    cursor: grab;  
}
.dragging {
    box-shadow: 3px 3px 5px #888888;
/*    transform-origin: right bottom; */
}
`,
monitor_balloon:
`
.monitor_balloon {
    position   : absolute; 
    display: none;
    padding: 2px;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.90);
    width:150px; 
    left : -1%; 
    font-size: 90%; 
}
/* ドラッグ中に有効にする monitor_baloon  */
.dragging .monitor_balloon {
    position   : absolute;
    display: inline;
    border-left: 5px solid rgba(102, 102, 255, 0.50);   /* 吹き出し口の幅・色 */
    border-top: 5px solid transparent;     /* 吹き出し口の高さ１／２ */
    border-bottom: 5px solid transparent;  /* 吹き出し口の高さ１／２ */
    right: -12px;                           /* 吹き出し口の位置調整 */
    top: 0%;                                /* 吹き出し口の縦位置 */
    content: "aaa";                       /* コンテンツの挿入 */
}
`
};

const Monitors = class {


    constructor() {
        this.map = new Map();
        this.v = {};
        const me = this;
        this._insertCss();
        
        window.addEventListener('resize', async function(){
            const keys = Array.from(me.map.keys());
            keys.map((k)=>{
                const v = me.map.get(k);
                v.resize();
            });
        }, false);
    }   
    _insertCss() {
        const style = document.createElement('style');
//        const _style = style.innerHTML;
        style.innerHTML = `
            ${CSS.monitar_container}\n\n
            ${CSS.monitor_balloon}\n\n
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    add(label, scale) {
        if(!this.map.has(label)) {
            const length = this.map.size;
            const v = new Monitor(label, length+1,  scale);
            this.map.set(label, v);
            this.v[label] = v;
        }
    }

    getVariable(label) {
        if(this.map.has(label)) {
            const v = this.map.get(label);
            return v;
        }
        return null;
    }
    automatic () {

        const mapKeys = this.map.keys();
        const keys = [...mapKeys];
        const sortKeys = keys.sort(function(a, b){
            a.no < b.no;
        })
        //console.log(sortKeys);

        let prevPosition;
        sortKeys.map((key,idx)=>{
            const v = this.map.get(key);
            const size = v.size;
            //console.log(size);
            if( prevPosition == undefined) {
                const x = 10;
                const y = 10;
                prevPosition = {x: x, y: y};
                v.setPosition( {x: x, y: y} );
            }else{
                const x = 10;
                const y = prevPosition.y + size.h;
                prevPosition = {x: x, y: y};
                v.setPosition( {x: x, y: y} );
            }
        })

    }

}

module.exports = Monitors;