/**
 * Sample04
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample04】 旗をクリックした後、ステージをクリック（タッチ）したら音を鳴らす";

const Jurassic = "Jurassic";
const Chill = "Chill";

let stage;

Pg.preload = function() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
}
Pg.prepare = function() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
}
Pg.setting = function() {
    // すぐに実行する。
    // アロー関数として インスタンス(this)を受け取る書き方もできる
    stage.Event.whenRightNow( async $stage=>{ 
        // ここでの『$s』は S.stageの『this』 である。
        await $stage.Sound.add( Chill );
        $stage.Sound.setOption( Lib.SoundOption.VOLUME, 100)
    });

    // ステージをクリックしたときの動作
    stage.Event.whenClicked( async $s=> {
        // 「終わるまで音を鳴らす」をずっと繰り返す
        await $s.C.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await $s.Sound.playUntilDone();
        });
    });
};