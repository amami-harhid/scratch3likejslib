/**
 * Sample13
 * スプライト（CAT) クリックした位置へ１秒で動く
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample13】クリックした位置へ１秒で動く"


Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.Image.add( Images.Cat );
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.Control.while(true, async _=>{
            await this.Sound.playUntilDone();
        });
    });
    St.stage.Event.whenClicked(async function(){
        // function() の中なので、【this】はProxy(stage)である。
        const mousePosition = Libs.mousePosition;
        await St.cat.glideToPosition( 1, mousePosition );
    });
    St.cat.Event.whenFlag(async function(){
        this.Motion.gotoXY({x:0, y:0});

    });
}