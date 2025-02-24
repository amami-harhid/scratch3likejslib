/**
 * Sample11
 * スプライト（CAT)を １秒で「どこかの」場所へ移動する
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample11】１秒で「どこかの」場所へ移動する"

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
            await Lib.wait(1000);
            // １秒でどこかへ行く
            const randomPoint = Lib.randomPoint;
            await this.Motion.glideToPosition(1,  randomPoint.x, randomPoint.y);
        })
    });
}