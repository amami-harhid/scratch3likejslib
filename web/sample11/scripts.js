/**
 * Sample11
 * スプライト（CAT)を １秒で「どこかの」場所へ移動する
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample11】１秒で「どこかの」場所へ移動する"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";

let stage, cat;

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg', Jurassic );
    this.Sound.load('../assets/Chill.wav', Chill );
    this.Image.load('../assets/cat.svg', Cat );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat = new Lib.Sprite("Cat");
    cat.Motion.gotoXY({x:0, y:0});
    cat.Image.add( Cat );
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function() {
        this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 50);
    });

    stage.Event.whenFlag(async function*() {
        // ずっと繰り返す
        while(true){
            await this.Sound.playUntilDone();
            yield;
        };
    });
    cat.Event.whenFlag(async function*() {
        this.Motion.gotoXY({x:0, y:0});
        while(true){
            // 繰り返すごとに 1秒待つ
            await Lib.wait(1000);
            // １秒でどこかへ行く
            const randomPoint = Lib.randomPoint;
            await this.Motion.glideToPosition(1,  randomPoint.x, randomPoint.y);
            yield;
        }
    });
}