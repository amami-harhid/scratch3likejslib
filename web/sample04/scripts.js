/**
 * Sample04
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 */
import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample04】 旗をクリックした後、ステージをクリック（タッチ）したら音を鳴らす";

const Jurassic = "Jurassic";
const Chill = "Chill";

let stage;

Pg.preload = function() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
}
Pg.prepare = async function() {
    stage = new Lib.Stage();
    await stage.Image.add( Jurassic );
    await stage.Sound.add( Chill );
}
Pg.setting = function() {
    // ステージをクリックしたときの動作
    // 音が鳴っている最中に再度クリックしたときの
    // 動作に着目してください（前回のイベント=音を鳴らす)をキャンセルした
    // うえで音が鳴り始めます。
    stage.Event.whenClicked( async function*(){
        // 音量 10
        await this.Sound.setOption( Lib.SoundOption.VOLUME, 10);
        // 「終わるまで音を鳴らす」をずっと繰り返す
        for(;;){
            // 処理が終わるまで待つために await をつける
            await this.Sound.playUntilDone();
            yield;
        }
    });
};