/**
 * Sample18
 * 
 * キーボード操作
 * 左矢印、右矢印で、シップが左右に動く。
 * スペースキーで 弾を発射（発射する弾はクローン）
 */

/**
 * 【課題】 音量の設定が効かない。常に１００％になる。
 */

import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample18】左右矢印でシップが左右に動き、スペースキーで弾を発射。"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cross01 = "Cross01";
const Cross02 = "Cross02";
const Pew = "Pew";

let stage, cross;

Pg.preload = async function preload($play) {
    $play.Image.load('../assets/Jurassic.svg', Jurassic );
    $play.Sound.load('../assets/Chill.wav', Chill );
    $play.Image.load('../assets/cross1.svg', Cross01 );
    $play.Image.load('../assets/cross2.svg', Cross02 );
    $play.Sound.load('../assets/Pew.wav', Pew );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );

    cross = new Lib.Sprite("Cross");
    cross.Motion.setY(-Lib.stageHeight/2 * 0.6); 
    cross.Image.add( Cross01 );
    cross.Image.add( Cross02 );
    cross.Looks.setSize({x:100,y:100});
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function( $this ) {
        // function() の中なので、【this】はstageである。
        $this.Sound.add( Chill ).then(me=>{
            me.Sound.setOption( Lib.SoundOption.VOLUME, 50 );
        });
    });
    cross.Event.whenFlag(async function( $this ){
        await $this.Sound.add( Pew );
        $this.Sound.setOption( Lib.SoundOption.VOLUME, 10 );
        $this.Sound.setOption( Lib.SoundOption.PITCH, 150 );
    });

    stage.Event.whenFlag(async function( $this ) {
        // function() の中なので、【this】はProxy(stage)である。
        $this.Control.forever( async _=>{
            await $this.Sound.playUntilDone();
        });
    });

    const MoveSteps = 15;
    cross.Event.whenFlag(async function( $this ){
        $this.direction = 90;
        $this.Control.forever( async _=>{
            if(Lib.keyIsDown('RightArrow')){
                $this.Motion.moveSteps(MoveSteps);
            }
            if(Lib.keyIsDown('LeftArrow')){
                $this.Motion.moveSteps(-MoveSteps);
            }
        });
    });
    cross.Event.whenFlag(async function( $this ){
        $this.Control.while(true, async _=>{
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(Lib.keyIsDown('Space')){
                $this.Sound.play();
                const options = {scale:{x:20,y:20}, direction:0}
                $this.C.clone(options);
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                //await Libs.waitWhile( ()=>Libs.keyIsDown('Space'));
            }
        });
    });
    cross.Control.whenCloned(async function( clone ){
        const {_,height} = clone.Looks.drawingDimensions();
        clone.Motion.changeY( height / 2);
        clone.Looks.nextCostume();
        clone.Looks.show();
    });
    cross.Control.whenCloned( async function( clone ) {
        // while の後に処理があるときは await 忘れないようにしましょう
        await clone.Control.forever( async _=>{
            clone.Motion.changeY(+10); // 10だけ上にする
            if(clone.Sensing.isTouchingEdge()){
                Lib.Loop.break();
            }
        });
        clone.Control.remove();
    });
    const TURN_RIGHT_DEGREE= 25;
    cross.Control.whenCloned( async function( clone ) {
        // while の後に処理があるときは await 忘れないようにしましょう
        clone.Sound.setOption( Lib.SoundOption.VOLUME, 50 );
        clone.Sound.setOption( Lib.SoundOption.PITCH, 80 );
        await clone.Control.forever( async _=>{
            clone.Motion.turnRightDegrees(TURN_RIGHT_DEGREE);
            if(clone.Sensing.isTouchingEdge()){
                clone.Sound.play();
                //await Lib.wait(500)

                Lib.Loop.break();
            }
        });
        clone.Control.remove();
    });
}