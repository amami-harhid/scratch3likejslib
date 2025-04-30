const Costumes = require('./costumes');
const Entity = require('./entity');
const PlayGround = require('./playGround');
const StageLayering = require('./stageLayering');
const S3MonitorImage = require('./monitor/s3MonitorImage');
const S3MonitorSkin = require('./monitor/s3MonitorSkin');
const Image = ''
const Monitor2 = class extends Entity {
    constructor(name){
        super(name, StageLayering.SPRITE_LAYER);
        this.visible = false;
        this.skin = null;
        //this.costumes = new Costumes();
        //this.costumes.addImage('image', S3MonitorImage.MONITOR_IMAGE);

    }
    createTextSkin(text){
        const skin = new S3MonitorSkin(9999, this.render.renderer);
        skin.setTextMonitor(text);
        this.skin = skin;
    }
    textRender(text, size = [100,100]) {
        this.skin.setTextMonitor(text);
        this.skin.getTexture(size);
    }
}

module.exports = Monitor2;