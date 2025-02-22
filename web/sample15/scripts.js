/**
 * Sample15
 * スプライト（CAT) は端を越えて進めない。
 */
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample15】端を越えては進めない。"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Lib.Sprite("Cat");
    St.cat.Motion.gotoXY({x:0, y:0});
    St.cat.Image.add( Images.Cat );
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.C.while(true, async _=>{
            await this.Sound.playUntilDone();
        });
    });
    St.cat.Event.whenFlag(async function($this){
        $this.Motion.gotoXY({x:0, y:0});
    });

    const CAT_WALK_STEP = 5;
    St.cat.Event.whenFlag(async function($this){
        $this.C.while(true, async _=>{
            $this.Motion.moveSteps(CAT_WALK_STEP);
        });
    });
}