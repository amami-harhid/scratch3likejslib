/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭ『終わるまで音を鳴らす』をずっと繰り返す。
 */
const main = function(Pg, Libs, St,  Images, Sounds){

    Pg.title = "【Sample03】旗クリックでずっと『終わるまで音を鳴らす』を繰り返す";

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
        St.stage.whenRightNow( function(){
            // ここでの『this』は Proxy(stage)である。
            this.addSound( Sounds.Chill, { 'volume' : 100 } );
        });
        St.stage.whenFlag( function(){ 
            // 「終わるまで音を鳴らす」をずっと繰り返す
            this.while(true, async _=>{
                // 処理が終わるまで待つために await をつける
                await this.startSoundUntilDone();
            });
        });
    };

};

// ライブラリーをインポートして実行
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'
main(PlayGround, Libs, Storage, Images, Sounds);