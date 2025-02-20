/**
 * Sample11
 * スプライト（CAT)を １秒で「どこかの」場所へ移動する
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample11】１秒で「どこかの」場所へ移動する"

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
        this.addSound( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.whenFlag(async function() {
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    St.cat.whenFlag(async function() {
        this.while(true, async _=>{
            // 繰り返すごとに 1秒待つ
            await Libs.wait(1000);
            // １秒でどこかへ行く
            const randomPoint = Libs.randomPoint;
            await this.glideToPosition(1,  randomPoint.x, randomPoint.y);
        })
    });
}