/**
 * Sample16
 * スプライト() : 回転方向⇒左右のみ回転 
 * スプライト（CAT2) : 回転方向⇒自由に回転  
 * スプライト（CAT3) : 回転方向⇒回転しない
 * 
 * 各スプライトはマウスポインターに向いて追いかける。
 * ５秒ごとに元の位置に戻る。
 */
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample16】３匹のネコの回転方向を変える"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );
    St.cat1 = new Lib.Sprite("Cat1");
    St.cat1.Image.add( Images.Cat );
    St.cat1.Motion.gotoXY({x:-Pg.stageWidth/4, y:+Pg.stageHeight/4 });
    St.cat1.Looks.setEffect("color", 50);
    St.cat1.Motion.setRotationStyle( Lib.RotationStyle.LEFT_RIGHT );

    St.cat2 = new Lib.Sprite("Cat2");
    St.cat2.Image.add( Images.Cat );
    St.cat2.Motion.gotoXY({x:0, y:0 });

    St.cat3 = new Lib.Sprite("Cat3");
    St.cat3.Image.add( Images.Cat );
    St.cat3.Motion.gotoXY({x:Pg.stageWidth /4, y:-Pg.stageHeight/4 });
    St.cat3.Looks.setEffect("color", 10);
    St.cat3.Motion.setRotationStyle( Lib.RotationStyle.DONT_ROTATE );
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.C.forever( async _=>{
            await this.Sound.playUntilDone();
        });
    });
    const WAIT_TIME = 5000;//5秒
    St.stage.Event.whenFlag(async function(){
        this.C.forever( async _=>{
            await Lib.wait(WAIT_TIME);
            St.cat1.Motion.gotoXY({x:-Pg.stageWidth/4, y:+Pg.stageHeight/4 });
            St.cat2.Motion.gotoXY({x:0, y:0 });
            St.cat3.Motion.gotoXY({x:Pg.stageWidth/4, y:-Pg.stageHeight/4 });
        });
    });

    const CAT_WALK_STEP = 2;
    St.cat1.Event.whenFlag(async function(){
        this.C.forever( async _=>{
            this.Motion.pointToMouse();
            this.Motion.moveSteps(CAT_WALK_STEP);
        });
    });

    St.cat2.Event.whenFlag(async function(){
        this.C.forever(async _=>{
            this.Motion.pointToMouse();
            this.Motion.moveSteps(CAT_WALK_STEP);
        });
    });

    St.cat3.Event.whenFlag(async function(){
        this.C.forever(async _=>{
            this.Motion.pointToMouse();
            this.Motion.moveSteps(CAT_WALK_STEP);
        });
    });
}