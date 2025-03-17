/**
 * Sample16
 * スプライト() : 回転方向⇒左右のみ回転 
 * スプライト（CAT2) : 回転方向⇒自由に回転  
 * スプライト（CAT3) : 回転方向⇒回転しない
 * 
 * 各スプライトはマウスポインターに向いて追いかける。
 * ５秒ごとに元の位置に戻る。
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample16】３匹のネコの回転方向を変える"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";

let stage, cat1, cat2, cat3;

Pg.preload = async function preload($this) {
    $this.Image.load('../assets/Jurassic.svg', Jurassic );
    $this.Sound.load('../assets/Chill.wav', Chill );
    $this.Image.load('../assets/cat.svg', Cat );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat1 = new Lib.Sprite("Cat1");
    cat1.Image.add( Cat );
    cat1.Motion.gotoXY({x:-Lib.stageWidth/4, y:+Lib.stageHeight/4 });
    cat1.Looks.setEffect(Lib.ImageEffective.COLOR, 50);
    cat1.Motion.setRotationStyle( Lib.RotationStyle.LEFT_RIGHT );

    cat2 = new Lib.Sprite("Cat2");
    cat2.Image.add( Cat );
    cat2.Motion.gotoXY({x:0, y:0 });

    cat3 = new Lib.Sprite("Cat3");
    cat3.Image.add( Cat );
    cat3.Motion.gotoXY({x:Lib.stageWidth /4, y:-Lib.stageHeight/4 });
    cat3.Looks.setEffect( Lib.ImageEffective.COLOR, 10);
    cat3.Motion.setRotationStyle( Lib.RotationStyle.DONT_ROTATE );
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 50 )
    });

    stage.Event.whenFlag(async function*() {
        // function() の中なので、【this】はProxy(stage)である。
        while(true){
            await this.Sound.playUntilDone();
            yield;
        }
    });
    const WAIT_TIME = 5000;//5秒
    stage.Event.whenFlag(async function*(){
        while(true){
            await Lib.wait(WAIT_TIME);
            cat1.Motion.gotoXY({x:-Lib.stageWidth/4, y:+Lib.stageHeight/4 });
            cat2.Motion.gotoXY({x:0, y:0 });
            cat3.Motion.gotoXY({x:Lib.stageWidth/4, y:-Lib.stageHeight/4 });
            yield;
        }
    });

    const CAT_WALK_STEP = 2;
    cat1.Event.whenFlag(async function*(){
        while(true){
            this.Motion.pointToMouse();
            this.Motion.moveSteps(CAT_WALK_STEP);
            yield;
        };
    });

    cat2.Event.whenFlag(async function*(){
        while(true){
            this.Motion.pointToMouse();
            this.Motion.moveSteps(CAT_WALK_STEP);
            yield;
        }
    });

    cat3.Event.whenFlag(async function*(){
        while(true){
            this.Motion.pointToMouse();
            this.Motion.moveSteps(CAT_WALK_STEP);
            yield;
        };
    });
}