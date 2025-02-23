/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭ『終わるまで音を鳴らす』をずっと繰り返す。
 */
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample03】旗クリックでずっと『終わるまで音を鳴らす』を繰り返す";

const Jurassic = 'Jurassic';
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
    St.stage.Event.whenRightNow( function(){
        // ここでの『this』は Proxy(stage)である。
        this.Sound.add( Chill, { 'volume' : 100 } );
    });
    St.stage.Event.whenFlag( function(){ 
        // 「終わるまで音を鳴らす」をずっと繰り返す
        this.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await this.Sound.playUntilDone();
        });
    });
};
