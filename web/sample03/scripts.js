/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭ『終わるまで音を鳴らす』をずっと繰り返す。
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample03】旗クリックでずっと『終わるまで音を鳴らす』を繰り返す";

const Jurassic = 'Jurassic';
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
    stage.Event.whenRightNow( function(){
        // ここでの『this』は Proxy(stage)である。
        this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 100 );
    });
    stage.Event.whenFlag( function(){ 
        // 「終わるまで音を鳴らす」をずっと繰り返す
        this.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await this.Sound.playUntilDone();
        });
    });
};
