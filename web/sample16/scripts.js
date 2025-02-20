/**
 * Sample16
 * スプライト() : 回転方向⇒左右のみ回転 
 * スプライト（CAT2) : 回転方向⇒自由に回転  
 * スプライト（CAT3) : 回転方向⇒回転しない
 * 
 * 各スプライトはマウスポインターに向いて追いかける。
 * ５秒ごとに元の位置に戻る。
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample16】３匹のネコの回転方向を変える"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );
    St.cat1 = new Libs.Sprite("Cat1");
    St.cat1.addImage( Images.Cat );
    St.cat1.setPosition( -Pg.stageWidth/4, +Pg.stageHeight/4 );
    St.cat1.effect.color = 50;
    St.cat1.setRotationStyle( Libs.RotationStyle.LEFT_RIGHT );

    St.cat2 = new Libs.Sprite("Cat2");
    St.cat2.addImage( Images.Cat );
    St.cat2.setPosition( 0, 0 );

    St.cat3 = new Libs.Sprite("Cat3");
    St.cat3.addImage( Images.Cat );
    St.cat3.setPosition( Pg.stageWidth /4, -Pg.stageHeight/4 );
    St.cat3.effect.color = 100;
    St.cat3.setRotationStyle( Libs.RotationStyle.DONT_ROTATE );
}

Pg.setting = async function setting() {

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    const WAIT_TIME = 5000;//5秒
    St.stage.whenFlag(async function(){
        this.while(true, async _=>{
            await Libs.wait(WAIT_TIME);
            St.cat1.setPosition( -Pg.stageWidth/4, +Pg.stageHeight/4 );
            St.cat2.setPosition( 0, 0 );
            St.cat3.setPosition( Pg.stageWidth /4, -Pg.stageHeight/4 );
        });
    });

    const CAT_WALK_STEP = 2;
    St.cat1.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });

    St.cat2.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });

    St.cat3.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });
}