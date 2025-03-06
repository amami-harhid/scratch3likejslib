/**
 * Sample09
 * スプライトのクローンを作る（スプライトをクリックしたらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample09】スプライトをクリックしたらクローンを作る。端に触れたらミャーとないて折り返す。"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";
const Mya = "Mya";

let stage, cat;

Pg.preload = async function preload($this) {
    $this.Image.load('../assets/Jurassic.svg', Jurassic);
    $this.Sound.load('../assets/Chill.wav', Chill);
    $this.Image.load('../assets/cat.svg', Cat);
    $this.Sound.load('../assets/Cat.wav', Mya);
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat = new Lib.Sprite("Cat");
    cat.Image.add( Cat );
}

const direction01 = 1;
Pg.setting = async function setting() {

    stage.Event.whenFlag(async function*(){
        // function(){} と書くとき、『this』は Proxy(stage)である
        this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 50 );
        while( true ){
            await this.Sound.playUntilDone();
            yield;
        }
    });
    cat.Event.whenFlag(function(){
        // 『this』は Proxy(cat)である
        this.Sound.add( Mya );
        this.Sound.setOption(Lib.SoundOption.VOLUME, 20)
    });
    cat.Event.whenFlag( async function(){
        // 初期化
        this.Motion.gotoXY({x:0, y:0});
        this.Motion.pointInDirection( 90 );
    });

    // { }の外側のスコープを参照できる
    const direction02 = 1;
    cat.Event.whenFlag( async function() {
        this.Control.while(true, ()=>{ 
            this.Motion.turnRightDegrees(direction01+direction02);
        });
    });
    cat.Event.whenClicked(async function () {
        //this.soundPlay();
        this.Control.clone();
    });

    const catStep = 10;
    cat.Control.whenCloned( async function*() {
        this.Looks.show();
        while(true){
            this.Motion.moveSteps(catStep);
            this.Motion.ifOnEdgeBounds();
            if(this.Sensing.isTouchingEdge() ){
                // ミャーと鳴く。
                this.Sound.play()
            }        
            yield;
        }
    });
}