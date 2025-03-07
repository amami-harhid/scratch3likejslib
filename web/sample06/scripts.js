/**
 * Sample06
 * フラグクリックでスプライトを表示する
 * スプライトにタッチするとBGMを繰返し鳴らす。
 */
// ライブラリーをインポートして実行
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample06】スプライトをタッチしたらＢＧＭを繰返し鳴らす";

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";
const SpriteCatName = "cat";

let stage, cat;

Pg.preload = async function preload($pg) {
    $pg.Image.load('../assets/Jurassic.svg', Jurassic);
    $pg.Sound.load('../assets/Chill.wav', Chill);
    $pg.Image.load('../assets/cat.svg', Cat);
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    // スプライトを作り、コスチュームを１個登録する
    cat = new Lib.Sprite( SpriteCatName );
    cat.Image.add( Cat );
    cat.Sound.add( Chill );
    cat.Sound.setOption( Lib.SoundOption.VOLUME, 100 );
    cat.Looks.hide(); // 非表示
}
Pg.setting = async function setting() {

    // フラグをクリックしたときの動作
    stage.Event.whenFlag( function(){
        // 本来は cat表示は catのwhenFlag()内で行うことが
        // 望ましいが、StageのwhenFlag()でも実行はできる。
        cat.Looks.show(); // 表示
    });

    // スプライト（ネコ）をクリックしたときの動作
    cat.Event.whenClicked( async function*(){
        const ネコ = this; // 変数名を全角文字にすることが可能。
        // 「終わるまで音を鳴らす」をずっと繰り返す
        while(true){
            // 処理が終わるまで待つために await をつける
            await ネコ.Sound.playUntilDone();
            yield;
        }
    });
}

