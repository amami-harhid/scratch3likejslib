/**
 * Sample18
 * 
 * キーボード操作
 * 左矢印、右矢印で、シップが左右に動く。
 * スペースキーで 弾を発射（発射する弾はクローン）
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample18】３匹のネコの回転方向を変える"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cross1.svg','Cross01');
    this.Image.load('../assets/cross2.svg','Cross02');
    this.Sound.load('../assets/Pew.wav','Pew');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );

    St.cross = new Libs.Sprite("Cross");
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
            if(Libs.keyIsDown('RightArrow')){
                this.Motion.moveSteps(MoveSteps);
            }
            if(Libs.keyIsDown('LeftArrow')){
                this.Motion.moveSteps(-MoveSteps);
            }
        });
    });
    St.cross.Event.whenFlag(async function(){
        this.C.while(true, async _=>{
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(Libs.keyIsDown('Space')){
                this.Sound.play();
                const options = {scale:{x:20,y:20},direction:0}
                this.C.clone(options);
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                //await Libs.waitWhile( ()=>Libs.keyIsDown('Space'));
            }
        });
    });
    St.cross.C.whenCloned(async function(){
        const c = this; // <--- cross instance;
        const {_,height} = c.Looks.getSelfDimensions();
        c.Motion.changeY( height / 2);
        c.Looks.nextCostume();
        c.Looks.show();
    });
    St.cross.C.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.Control.forever( async _=>{
            c.Motion.changeY(+10); // 10だけ上にする
            if(c.Sensing.isTouchingEdge()){
                Libs.Loop.break();
            }
        });
        c.remove();
    });
    const TURN_RIGHT_DEGREE= 15;
    St.cross.C.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.Control.while(true, async _=>{
            if(c.Sensing.isTouchingEdge()){
                Libs.Loop.break();
            }
        });
        c.remove();
    });
}