/**
 * Sample04
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 */
import {PlayGround, Library, Storage} from '../../build/likeScratchLib.js'
const [Pg, Lib, St,] = [PlayGround, Library, Storage]; // 短縮名にする

Pg.title = "【Sample04】 旗をクリックした後、ステージをクリック（タッチ）したら音を鳴らす";

const Jurassic = "Jurassic";
const Chill = "Chill";

Pg.preload = function() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
}
Pg.prepare = function() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Jurassic );
}
Pg.setting = function() {
    // すぐに実行する。
    // アロー関数として インスタンス(this)を受け取る書き方もできる
    St.stage.Event.whenRightNow( async $s=>{ 
        // ここでの『$s』は S.stageの『this』 である。
        await $s.Sound.add( Chill, { 'volume' : 100 } );
    });

    // ステージをクリックしたときの動作
    St.stage.Event.whenClicked( async $s=> {
        // 「終わるまで音を鳴らす」をずっと繰り返す
        await $s.C.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await $s.Sound.playUntilDone();
        });
    });
};