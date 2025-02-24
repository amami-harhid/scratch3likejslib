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

    stage.Event.whenFlag(function($stage){
        // function(){} と書くとき、『this』は Proxy(stage)である
        $stage.Sound.add( Chill );
        $stage.Sound.setOption( Lib.SoundOption.VOLUME, 50 );
        $stage.Control.while(true, async _=>{
            await this.Sound.playUntilDone();
        })
    });
    cat.Event.whenFlag(function($cat){
        // function(){} と書くとき、『this』は Proxy(cat)である
        $cat.Sound.add( Mya );
        $cat.Sound.setOption(Lib.SoundOption.VOLUME, 20)
    });
    cat.Event.whenFlag( async $cat=> {
        // 初期化
        $cat.Motion.gotoXY({x:0, y:0});
        $cat.Motion.pointInDirection( 90 );
    });

    // { }の外側のスコープを参照できる
    const direction02 = 1;
    cat.Event.whenFlag( async function($cat) {
        $cat.Control.while(true, _=>{
            $cat.Motion.turnRightDegrees(direction01+direction02);
        });
    });
    cat.Event.whenClicked(async function ($cat) {
        //this.soundPlay();
        $cat.Control.clone();
    });

    const catStep = 10;
    cat.Control.whenCloned( async function($cat) {
        $cat.Looks.show();
        $cat.Control.while(true, _=>{
            $cat.Motion.moveSteps(catStep);
            $cat.Motion.ifOnEdgeBounds();
            if($cat.Sensing.isTouchingEdge() ){
                // ミャーと鳴く。
                $cat.Sound.play()
            }        
        });
    });
}