/**
 * Sample04
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 */

import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;

(function(Pg, St, Libs, Images, Sounds){

    Pg.title = "【Sample04】 旗をクリックした後、ステージをクリック（タッチ）したら音を鳴らす";

    Pg.preload = function() {
        this.loadImage('../assets/Jurassic.svg','Jurassic');
        this.loadSound('../assets/Chill.wav','Chill');
    }
    Pg.prepare = function() {
        St.stage = new Libs.Stage();
        St.stage.addImage( Images.Jurassic );
    }
    Pg.setting = function() {
        // すぐに実行する。
        // アロー関数として インスタンス(this)を受け取る書き方もできる
        St.stage.whenRightNow( async $s=>{ 
            // ここでの『$s』は S.stageの『this』 である。
            await $s.addSound( Sounds.Chill, { 'volume' : 100 } );
        });

        // ステージをクリックしたときの動作
        St.stage.whenClicked( async $s=> {
            // 「終わるまで音を鳴らす」をずっと繰り返す
            await $s.while(true, async _=>{
                // 処理が終わるまで待つために await をつける
                await $s.startSoundUntilDone();
            });
        });
    };

})(SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds);
