const Monitor = require('./monitor');
const Libs = require('../libs');
const PADDING = 0;
const Monitors = class {
    /**
     * @constructor
     */
    constructor() {
        this._monitors = [];
    }
    /**
     * add
     * @param {string} id - Monitor id 
     * @param {string} label - Monitor label 
     */
    add(id, label) {
        let x = 0;
        let y = 0;
        for(const _monitor of this._monitors){
            const _size = _monitor.skin.size;
            //x += _size[0] + PADDING;
            y += _size[1] + PADDING;
        }
        const rate = Libs.default.renderRate;
        const _rate = Math.min( rate.x, rate.y );
        const monitor = new Monitor(id, label);
        monitor.createTextSkin(x*_rate, y*_rate);
        this._monitors.push(monitor);
    }
    get(id){
        for(const _monitor of this._monitors){
            if(id === _monitor.id){
                return _monitor;
            }
        }
        throw `指定した${id}のMonitorはありません`;
    }
    show(id){
        for(const _monitor of this._monitors){
            if(id === _monitor.id){
                _monitor.show();
                break;
            }
        }
        throw `指定した${id}のMonitorはありません`;
    }
    hide(id){
        for(const _monitor of this._monitors){
            if(id === _monitor.id){
                _monitor.hide();
                break;
            }
        }
        throw `指定した${id}のMonitorはありません`;
    }
}

module.exports = Monitors;