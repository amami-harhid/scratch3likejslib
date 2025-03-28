/**
 * sample25
 * 色に触れたときの判定
 */

import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample25】リンゴの色に触れたときネコが鳴く"

const Apple = "Apple";
const Cat01 = "Cat01";
const Cat02 = "Cat02";
const Mya = "Mya";

let stage;
let cat;
let apple;

Pg.preload = async function () {
    this.Sound.load('../assets/Cat.wav', Mya );
    this.Image.load('../assets/apple.svg', Apple );
    this.Image.load('../assets/cat.svg', Cat01 );
    this.Image.load('../assets/cat2.svg', Cat02 );
}
Pg.prepare = async function () {
    stage = new Lib.Stage();
    cat = new Lib.Sprite( 'cat' );
    await cat.Image.add( Cat01 );
    await cat.Image.add( Cat02 );
    await cat.Sound.add( Mya );
    apple = new Lib.Sprite( 'Apple' );
    await apple.Image.add( Apple );
    apple.Motion.gotoXY(150,100);

}

Pg.setting = async function () {
    const TargetColor = '#ec1c2c'; // リンゴの赤い色
    cat.Event.whenFlag(async function*(){
        this.Motion.setXY(0,0);
        this.Motion.pointInDirection(90);
        this.Looks.goToFront();
        for(;;){
            this.Motion.pointToMouse();
            this.Motion.moveSteps(5);
            if(await this.Sensing.isTouchingToColor(TargetColor)){
                //this.Motion.moveSteps(-5);
                this.Sound.play(Mya);
            }
            yield;
        }
    });


}