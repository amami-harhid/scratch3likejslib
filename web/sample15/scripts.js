/**
 * Sample15
 * スプライト（CAT) は端を越えて進めない。
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample15】端を越えては進めない。"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.position.x = 0;
    St.cat.position.y = 0;
    St.cat.addImage( Images.Cat );
}

Pg.setting = async function setting() {

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    const CAT_WALK_STEP = 5;
    St.cat.whenFlag(async function(){
        this.while(true, async _=>{
            this.moveSteps(CAT_WALK_STEP);
        });
    });
}