/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭ『終わるまで音を鳴らす』をずっと繰り返す。
 */
const main = function(Pg, Libs, St,  Images, Sounds){

    Pg.title = "【Sample03】旗クリックでずっと『終わるまで音を鳴らす』を繰り返す";

    Pg.preload = function() {
        this.Image.load('../assets/Jurassic.svg','Jurassic');
        this.Sound.load('../assets/Chill.wav','Chill');
    }
    Pg.prepare = function() {
        St.stage = new Libs.Stage();
        St.stage.Image.add( Images.Jurassic );
    }
    Pg.setting = function() {
        // すぐに実行する。
        St.stage.Event.whenRightNow( function(){
            // ここでの『this』は Proxy(stage)である。
            this.Sound.add( Sounds.Chill, { 'volume' : 100 } );
        });
        St.stage.Event.whenFlag( function(){ 
            // 「終わるまで音を鳴らす」をずっと繰り返す
            this.while(true, async _=>{
                // 処理が終わるまで待つために await をつける
                await this.Sound.playUntilDone();
            });
        });
    };

};

// ライブラリーをインポートして実行
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'
main(PlayGround, Libs, Storage, Images, Sounds);