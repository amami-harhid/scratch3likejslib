const Monitor = require('./monitor');
const Libs = require('../libs');
const PlayGround = require('../playGround');
const S3MonitorSkin = require('./s3MonitorSkin');
const PADDING = 0;
const Monitors = class {
    /**
     * @constructor
     */
    constructor() {
        this._monitors = [];
        const render = PlayGround.default.render;
        const renderer = render.renderer;
        function s3CreateMonitorSkin(label) {
            const skinId = renderer._nextSkinId++;
            const newSkin = new S3MonitorSkin(skinId, renderer, label );
            // 
            renderer._allSkins[skinId] = newSkin;
            return skinId;
        }
        function getS3Skin(skinId) {
            return renderer._allSkins[skinId];
        }
        renderer.s3CreateMonitorSkin = s3CreateMonitorSkin;
        renderer.getS3Skin = getS3Skin;
    }
    /**
     * add
     * @param {string} monitorId - Monitor id 
     * @param {string} label - Monitor label 
     */
    add(monitorId, label) {
        let x = 0;
        let y = 0;
        for(const _monitor of this._monitors){
            const _size = _monitor.skin.size;
            //x += _size[0] + PADDING;
            y += _size[1] + PADDING;
        }
        const rate = Libs.default.renderRate;
        const _rate = Math.min( rate.x, rate.y );
        const monitor = new Monitor(monitorId, label);
//        monitor.createTextSkin(x*_rate, y*_rate);
        monitor.createTextSkin(0, 0);
        this._monitors.push(monitor);
    }
    get(monitorId){
        for(const _monitor of this._monitors){
            if(monitorId === _monitor.monitorId){
                return _monitor;
            }
        }
        throw `指定した${monitorId}のMonitorはありません`;
    }
    show(monitorId){
        for(const _monitor of this._monitors){
            if(monitorId === _monitor.monitorId){
                _monitor.show();
                break;
            }
        }
        throw `指定した${monitorId}のMonitorはありません`;
    }
    hide(monitorId){
        for(const _monitor of this._monitors){
            if(monitorId === _monitor.monitorId){
                _monitor.hide();
                break;
            }
        }
        throw `指定した${monitorId}のMonitorはありません`;
    }
}

module.exports = Monitors;