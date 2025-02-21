/**
 * Sample11
 * スプライト（CAT)を １秒で「どこかの」場所へ移動する
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample11】１秒で「どこかの」場所へ移動する"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.Motion.gotoXY({x:0, y:0});
    St.cat.Image.add( Images.Cat );
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.Event.whenFlag(async function() {
        this.Control.forever(async _=>{
            await this.Sound.playUntilDone();
        });
    });
    St.cat.Event.whenFlag(async function() {
        this.Control.forever(async _=>{
            // 繰り返すごとに 1秒待つ
            await Libs.wait(1000);
            // １秒でどこかへ行く
            const randomPoint = Libs.randomPoint;
            await this.Motion.glideToPosition(1,  randomPoint.x, randomPoint.y);
        })
    });
}