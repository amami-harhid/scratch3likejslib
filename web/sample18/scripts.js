/**
 * Sample18
 * 
 * キーボード操作
 * 左矢印、右矢印で、シップが左右に動く。
 * スペースキーで 弾を発射（発射する弾はクローン）
 */

import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample18】左右矢印でシップが左右に動き、スペースキーで弾を発射。"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cross01 = "Cross01";
const Cross02 = "Cross02";
const Pew = "Pew";

let stage, cross;

Pg.preload = async function preload() {
    const $play = this;
    $play.Image.load('../assets/Jurassic.svg', Jurassic );
    $play.Sound.load('../assets/Chill.wav', Chill );
    $play.Image.load('../assets/cross1.svg', Cross01 );
    $play.Image.load('../assets/cross2.svg', Cross02 );
    $play.Sound.load('../assets/Pew.wav', Pew );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    await stage.Image.add( Jurassic );
    await stage.Sound.add( Chill );

    cross = new Lib.Sprite("Cross");
    cross.Motion.setY(-Lib.stageHeight/2 * 0.6); 
    await cross.Image.add( Cross01 );
    await cross.Image.add( Cross02 );
    await cross.Sound.add( Pew );
    cross.Looks.setSize({w:100,h:100});
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function*() {
        await this.Sound.setOption( Lib.SoundOption.VOLUME, 50 );
        // 【this】はProxy(stage)である。
        while(true){
            await this.Sound.playUntilDone(Chill);
            yield;
        };
    });

    const MoveSteps = 15;
    cross.Event.whenFlag(async function*(){
        this.direction = 90;
        while(true){
            if(Lib.keyIsDown('RightArrow')){
                this.Motion.moveSteps(MoveSteps);
            }
            if(Lib.keyIsDown('LeftArrow')){
                this.Motion.moveSteps(-MoveSteps);
            }
            yield;
        };
    });
    cross.Event.whenFlag(async function*(){
        await this.Sound.setOption( Lib.SoundOption.VOLUME, 100 );
        await this.Sound.setOption( Lib.SoundOption.PITCH, 150 );
        while(true){
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(Lib.keyIsDown('Space')){
                this.Sound.play(Pew);
                const options = {scale:{w:20,h:20}, direction:0}
                this.Control.clone(options);
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                //await Libs.waitWhile( ()=>Lib.keyIsDown('Space'));
            }
            yield;
        };
    });
    cross.Control.whenCloned(async function(){
        const clone = this;
        const {height} = clone.Looks.drawingDimensions();
        clone.Motion.changeY( height / 2);
        clone.Looks.nextCostume();
        clone.Looks.show();
    });
    const TURN_RIGHT_DEGREE= 25;
    cross.Control.whenCloned( async function*() {
        const clone = this;
        await clone.Sound.setOption( Lib.SoundOption.VOLUME, 100 );
        await clone.Sound.setOption( Lib.SoundOption.PITCH, 20 ); // 低音にする
        // while の後に処理があるときは await 忘れないようにしましょう
        while(true){
            clone.Motion.turnRightDegrees(TURN_RIGHT_DEGREE);
            if(clone.Sensing.isTouchingEdge()){
                clone.Sound.play(Pew);
                break;
            }
            yield;
        };
        clone.Control.wait(0.5);
        clone.Control.remove();
    });
    cross.Control.whenCloned( async function*() {
        const clone = this;
        // while の後に処理があるときは await 忘れないようにしましょう
        while(true){
            clone.Motion.changeY(+10); // 10だけ上にする
            if(clone.Sensing.isTouchingEdge()){
                break;
            }
            yield;
        };
    });

}