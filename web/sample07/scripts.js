/**
 * Sample07
 * スプライトを左右に動かす。端に触れたら跳ね返る
 */
import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample07】スプライトが横向きに動き、端に触れたら跳ね返る"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage();
    St.stage.addImage( Images.Jurassic );
    St.stage.addSound( Sounds.Chill, { 'volume' : 100 } );
    St.cat = new Libs.Sprite("Cat");
    St.cat.addImage( Images.Cat );
}
Pg.setting = async function setting() {

    // フラグクリック
    St.stage.whenFlag( async stage=> {
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        await stage.while( true, async _=> {
            await stage.startSoundUntilDone();
        });
    });

    const catStep = 5;
    // フラグクリック
    St.cat.whenFlag( async cat=> {
        // 初期化
        cat.position = {x:0, y:0};
        cat.direction = 90;
    });
    St.cat.whenFlag( async cat=> {
        // 「左右」に動く。端に触れたら跳ね返る。
        await cat.while( true, async _=> {
            cat.moveSteps(catStep);
            cat.ifOnEdgeBounds();
        });
    });


}