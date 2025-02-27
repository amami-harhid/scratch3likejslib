/**
 * Sample07
 * スプライトを左右に動かす。端に触れたら跳ね返る
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample07】スプライトが横向きに動き、端に触れたら跳ね返る"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";
const SpriteCatName = "cat";

let stage, cat;

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
    this.Image.load('../assets/cat.svg', Cat);
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    const key = Lib.SoundOption.VOLUME;
    stage.Sound.add( Chill );
    stage.Sound.setOption(Lib.SoundOption.VOLUME, 100);
    cat = new Lib.Sprite( SpriteCatName );
    cat.Image.add( Cat );
}
Pg.setting = async function setting() {

    // フラグクリック
    stage.Event.whenFlag( async function(){
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        await this.while( true, async function(){
            await this.Sound.playUntilDone();
        });
    });

    const catStep = 5;
    // フラグクリック
    cat.Event.whenFlag( async function(){
        // 初期化
        this.Motion.gotoXY({x:0, y:0});
        this.Motion.pointInDerection( 90 );
    });
    cat.Event.whenFlag( async function(){
        // 「左右」に動く。端に触れたら跳ね返る。
        await this.Control.forever( _=> {
            this.Motion.moveSteps(catStep);
            this.Motion.ifOnEdgeBounds();
        });
    });
}