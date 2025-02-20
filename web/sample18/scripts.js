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
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cross1.svg','Cross01');
    this.loadImage('../assets/cross2.svg','Cross02');
    this.loadSound('../assets/Pew.wav','Pew');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );

    St.cross = new Libs.Sprite("Cross");
    St.cross.position.y = -Pg.stageHeight/2 * 0.6 
    St.cross.addImage( Images.Cross01 );
    St.cross.addImage( Images.Cross02 );
    St.cross.setScale(100,100);
}

Pg.setting = async function setting() {

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( Sounds.Chill, { 'volume' : 20 } );
    });
    St.cross.whenFlag(async function(){
        this.addSound( Sounds.Pew, { 'volume' : 100 } );
    });

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    const MoveSteps = 15;
    St.cross.whenFlag(async function(){
        this.direction = 90;
        this.while(true, async _=>{
            if(Libs.keyIsDown('RightArrow')){
                this.moveSteps(MoveSteps);
            }
            if(Libs.keyIsDown('LeftArrow')){
                this.moveSteps(-MoveSteps);
            }
        });
    });
    St.cross.whenFlag(async function(){
        this.while(true, async _=>{
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(Libs.keyIsDown('Space')){
                this.soundPlay();
                const options = {scale:{x:20,y:20},direction:0}
                this.clone(options);
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                //await Libs.waitWhile( ()=>Libs.keyIsDown('Space'));
            }
        });
    });
    St.cross.whenCloned(async function(){
        const c = this; // <--- cross instance;
        const bounds = c.render.renderer.getBounds(c.drawableID);
        const height = Math.abs(bounds.top - bounds.bottom);
        c.position.y += height / 2;
        c.nextCostume();
        c.setVisible(true);
    });
    St.cross.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.while(true, async _=>{
            const x = this.position.x;
            const y = this.position.y;
            c.setXY(x,y+10);
            if(c.isTouchingEdge()){
                Libs.Loop.break();
            }
        });
        c.remove();
    });
    const TURN_RIGHT_DEGREE= 15;
    St.cross.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.while(true, async _=>{
            if(c.isTouchingEdge()){
                Libs.Loop.break();
            }
        });
        c.remove();
    });
}