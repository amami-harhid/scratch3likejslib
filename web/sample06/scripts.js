/**
 * Sample06
 * フラグクリックでスプライトを表示する
 * スプライトにタッチするとBGMを繰返し鳴らす。
 */
// ライブラリーをインポートして実行
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample06】スプライトをタッチしたらＢＧＭを繰返し鳴らす";

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage();
    St.stage.Image.add( Images.Jurassic );
    // スプライトを作り、コスチュームを１個登録する
    St.cat = new Libs.Sprite("Cat");
    St.cat.Image.add( Images.Cat );
    St.cat.Sound.add( Sounds.Chill, { 'volume' : 100 } );
    St.cat.Looks.hide(); // 非表示
}
Pg.setting = async function setting() {

    // フラグをクリックしたときの動作
    St.stage.Event.whenFlag( _=> {
        // アロー関数なので、ここでの『this』はPである
        St.cat.Looks.show(); // 表示
    });

    // スプライト（ネコ）をクリックしたときの動作
    St.cat.Event.whenClicked( async (ネコ) => {
        // アロー関数なので、ここでの『this』はPである
        // catのインスタンスは 『ネコ』として受け取っている。
        // 「終わるまで音を鳴らす」をずっと繰り返す
        ネコ.C.forever(async _=>{
            // 処理が終わるまで待つために await をつける
            await ネコ.Sound.playUntilDone();
        });
    });
}

