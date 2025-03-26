/**
 * Sample08
 * スプライトを 動かす( 端に触れたら ミャーと鳴く)
 */
import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample08】スプライトが動き、端に触れたらミャーと鳴く"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";
const Mya = "Mya";

let stage, cat;

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
    this.Image.load('../assets/cat.svg', Cat);
    this.Sound.load('../assets/Cat.wav', Mya);
}
let stageSoundVolume = 5;
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    await stage.Image.add( Jurassic );
    await stage.Sound.add( Chill );
    
    cat = new Lib.Sprite("Cat");
    await cat.Image.add( Cat );
    await cat.Sound.add( Mya );
}
Pg.setting = async function setting() {

    stage.Event.whenFlag(async function*(){
        await stage.Sound.setOption( Lib.SoundOption.VOLUME, stageSoundVolume );
        while(true){
            stageSoundVolume+=1;
            // ＢＧＭを鳴らし続ける（終わるまで待つ）
            await this.Sound.playUntilDone(Chill);
            if(stageSoundVolume < 200) {
                await stage.Sound.setOption( Lib.SoundOption.VOLUME, stageSoundVolume );
            }
            yield;
        }
    });

    const catStep = 5;

    cat.Event.whenFlag( async function(){
        // 初期化
        this.Motion.gotoXY({x:0, y:0});
        this.Motion.pointInDirection( 50 );
    });
    let counter = 0;
    cat.Event.whenFlag( async function*(){
        // ずっと「左右」に動く。端に触れたら跳ね返る。
        await cat.Sound.setOption( Lib.SoundOption.VOLUME, 5);
        while(true){
            this.Motion.moveSteps(catStep);
            this.Motion.ifOnEdgeBounds();
            if(this.Sensing.isTouchingEdge()){
                this.Sound.play(Mya); // ニャーと鳴く
            }
            yield;
        }
    });


}