/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭ『終わるまで音を鳴らす』をずっと繰り返す。
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample03】旗クリックでずっと『終わるまで音を鳴らす』を繰り返す";

const Jurassic = 'Jurassic';
const Jurassic2 = 'Jurassic2';
const Chill = "Chill";

let stage;

Pg.preload = function() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Image.load('../assets/Jurassic2.svg', Jurassic2);
    this.Sound.load('../assets/Chill.wav', Chill);
}
Pg.prepare = async function() {
    stage = new Lib.Stage();
    await stage.Image.add( Jurassic );
    await stage.Image.add( Jurassic2 );
}
Pg.setting = function() {
    // すぐに実行する。
    stage.Event.whenRightNow( async function(){
        // ここでの『this』は Proxy(stage)である。
        this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 100 );
    });
    stage.Event.whenFlag( async function*(){ 
        // 「終わるまで音を鳴らす」をずっと繰り返す
        while(true){
            // 処理が終わるまで待つために await をつける
            await this.Sound.playUntilDone();
            yield
        }
    });
    stage.Event.whenFlag( async function*(){ 
        // 「終わるまで音を鳴らす」をずっと繰り返す
        while(true){
            await this.Control.wait(1);
            await this.Looks.switchBackdrop(Jurassic);
            await this.Control.wait(1);
            await this.Looks.switchBackdrop(Jurassic2);
            yield
        }
    });
};
