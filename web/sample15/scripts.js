/**
 * Sample15
 * スプライト（CAT) は端を越えて進めない。
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample15】端を越えては進めない。"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";

let stage, cat;

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill );
    this.Image.load('../assets/cat.svg', Cat );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat = new Lib.Sprite("Cat");
    cat.Motion.gotoXY( {x:0, y:0} );
    cat.Image.add( Cat );
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        await this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 50);
    });

    stage.Event.whenFlag(async function*() {
        // function() の中なので、【this】はProxy(stage)である。
        while(true){
            await this.Sound.playUntilDone();
            yield;
        }
    });
    cat.Event.whenFlag(async function(){
        this.Motion.gotoXY({x:0, y:0});
    });

    const CAT_WALK_STEP = 5;
    cat.Event.whenFlag(async function(){
        this.Control.forever( async ()=>{
            this.Motion.moveSteps(CAT_WALK_STEP);
        });
    });
}