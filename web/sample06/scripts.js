/**
 * Sample06
 * フラグクリックでスプライトを表示する
 * スプライトにタッチするとBGMを繰返し鳴らす。
 */

import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample06】スプライトをタッチしたらＢＧＭを繰返し鳴らす";

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage();
    St.stage.addImage( Images.Jurassic );
    // スプライトを作り、コスチュームを１個登録する
    St.cat = new Libs.Sprite("Cat");
    St.cat.addImage( Images.Cat );
    St.cat.addSound( Sounds.Chill, { 'volume' : 100 } );
    St.cat.visible = false; // 非表示
}
Pg.setting = async function setting() {

    // フラグをクリックしたときの動作
    St.stage.whenFlag( _=> {
        // アロー関数なので、ここでの『this』はPである
        St.cat.visible = true; // 表示
    });

    // スプライト（ネコ）をクリックしたときの動作
    St.cat.whenClicked( async (ネコ) => {
        // アロー関数なので、ここでの『this』はPである
        // catのインスタンスは 『ネコ』として受け取っている。
        // 「終わるまで音を鳴らす」をずっと繰り返す
        ネコ.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await ネコ.startSoundUntilDone();
        });
    });
}
