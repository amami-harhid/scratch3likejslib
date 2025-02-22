/**
 * Sample18
 * 
 * キーボード操作
 * 左矢印、右矢印で、シップが左右に動く。
 * スペースキーで 弾を発射（発射する弾はクローン）
 */
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample18】３匹のネコの回転方向を変える"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cross1.svg','Cross01');
    this.Image.load('../assets/cross2.svg','Cross02');
    this.Sound.load('../assets/Pew.wav','Pew');
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );

    St.cross = new Lib.Sprite("Cross");
    St.cross.Motion.setY(-Pg.stageHeight/2 * 0.6); 
    St.cross.Image.add( Images.Cross01 );
    St.cross.Image.add( Images.Cross02 );
    St.cross.Looks.setSize({x:100,y:100});
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Sounds.Chill, { 'volume' : 20 } );
    });
    St.cross.Event.whenFlag(async function(){
        this.Sound.add( Sounds.Pew, { 'volume' : 100 } );
    });

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.C.forever( async _=>{
            await this.Sound.playUntilDone();
        });
    });

    const MoveSteps = 15;
    St.cross.Event.whenFlag(async function(){
        this.direction = 90;
        this.C.forever( async _=>{
            if(Lib.keyIsDown('RightArrow')){
                this.Motion.moveSteps(MoveSteps);
            }
            if(Lib.keyIsDown('LeftArrow')){
                this.Motion.moveSteps(-MoveSteps);
            }
        });
    });
    St.cross.Event.whenFlag(async function(){
        this.C.while(true, async _=>{
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(Lib.keyIsDown('Space')){
                this.Sound.play();
                const options = {scale:{x:20,y:20},direction:0}
                this.C.clone(options);
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                //await Libs.waitWhile( ()=>Libs.keyIsDown('Space'));
            }
        });
    });
    St.cross.C.whenCloned(async function(){
        const clone = this; // <--- cross instance;
        const {_,height} = clone.Looks.getSelfDimensions();
        clone.Motion.changeY( height / 2);
        clone.Looks.nextCostume();
        clone.Looks.show();
    });
    St.cross.C.whenCloned( async function() {
        const clone = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await clone.Control.forever( async _=>{
            clone.Motion.changeY(+10); // 10だけ上にする
            if(clone.Sensing.isTouchingEdge()){
                Lib.Loop.break();
            }
        });
        clone.remove();
    });
    const TURN_RIGHT_DEGREE= 25;
    St.cross.C.whenCloned( async function() {
        const clone = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await clone.Control.while(true, async _=>{
            clone.Motion.turnRightDegrees(TURN_RIGHT_DEGREE);
            if(clone.Sensing.isTouchingEdge()){
                Lib.Loop.break();
            }
        });
        clone.remove();
    });
}