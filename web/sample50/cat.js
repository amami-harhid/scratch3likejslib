export class MyCat extends P.Sprite {
    constructor(stage, name, options) {
        super(stage, name, options);
        this.life = Infinity;
    
    }

    update() {
        super.update();
        if( this.life < 0 ) {
            this.soundSwitch(P.sounds.Cat)
            this.soundPlay();
        }    
    }
}