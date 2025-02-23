/**
 * Sample07
 * スプライトを左右に動かす。端に触れたら跳ね返る
 */
import {PlayGround, Library, Storage} from '../../build/likeScratchLib.js'
const [Pg, Lib, St] = [PlayGround, Library, Storage]; // 短縮名にする

Pg.title = "【Sample07】スプライトが横向きに動き、端に触れたら跳ね返る"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";
const SpriteCatName = "cat";

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
    this.Image.load('../assets/cat.svg', Cat);
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.addImage( Jurassic );
    St.stage.addSound( Chill, { 'volume' : 100 } );
    St.cat = new Lib.Sprite( SpriteCatName );
    St.cat.Image.add( Cat );
}
Pg.setting = async function setting() {

    // フラグクリック
    St.stage.Event.whenFlag( async stage=> {
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        await stage.while( true, async _=> {
            await stage.Sound.playUntilDone();
        });
    });

    const catStep = 5;
    // フラグクリック
    St.cat.Event.whenFlag( async cat=> {
        // 初期化
        cat.M.gotoXY({x:0, y:0});
        cat.M.pointInDerection( 90 );
    });
    St.cat.Event.whenFlag( async cat=> {
        // 「左右」に動く。端に触れたら跳ね返る。
        await cat.C.forever( async _=> {
            cat.M.moveSteps(catStep);
            cat.M.ifOnEdgeBounds();
        });
    });


}