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
        function s3CreateMonitorSkin(drawableID, label) {
            const skinId = renderer._nextSkinId++;
            const newSkin = new S3MonitorSkin(skinId, renderer, label );
            const drawable = renderer._allDrawables[drawableID];
            renderer._allSkins[skinId] = newSkin;
            drawable.skin = newSkin;
            return skinId;
        }
        function getS3Skin(skinId) {
            return renderer._allSkins[skinId];
        }
        renderer.s3CreateMonitorSkin = s3CreateMonitorSkin;
        renderer.getS3Skin = getS3Skin;
        PlayGround.default.monitors = this;
    }
    /**
     * add
     * @param {string} monitorId - Monitor id 
     * @param {string} label - Monitor label 
     */
    add(monitorId, label) {
        for(const _monitor of this._monitors){
            if(monitorId === _monitor.monitorId) {
                return;
            }
        }
        const monitor = new Monitor(monitorId, label);
        monitor.createTextSkin();
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
    draw() {
        for(const _monitor of this._monitors){
            _monitor.draw();
        }
    }
}

module.exports = Monitors;