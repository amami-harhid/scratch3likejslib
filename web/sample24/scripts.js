/**
 * sample24
 * モニターを数個表示する
 * １秒タイマーのモニター
 * スプライトをクリックした回数のモニター
 * スプライトが端に触れた回数のモニター
 */

import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample24】ボールがランダムな方向へ動き端についたら跳ね返る"

const NeonTunnel = "NeonTunnel";
const Chill = "Chill";
const Ball = "Ball";

let stage;
let ball;
let monitors;

const SECONDS_COUNTER =         "secondsCounter";
let secondsCounter = 0;
const BORDER_TOUCHING_COUNTER = "borderTouchingCounter";
let borderTouchingCounter = 0;

Pg.preload = async function () {
    this.Sound.load('../assets/Chill.wav', Chill );
    this.Image.load('./assets/Neon Tunnel.png', NeonTunnel );
    this.Image.load('./assets/ball-a.svg', Ball );
}
Pg.prepare = async function () {
    stage = new Lib.Stage();
    await stage.Image.add( NeonTunnel );
    await stage.Sound.add( Chill );
    ball = new Lib.Sprite("ball");
    await ball.Image.add( Ball );
    ball.Looks.setSize(50, 50);
    monitors = new Lib.Monitors();
    monitors.add(SECONDS_COUNTER, "秒数");
    monitors.add(BORDER_TOUCHING_COUNTER, "回数");

    monitors.get(SECONDS_COUNTER).text = secondsCounter;
    monitors.get(BORDER_TOUCHING_COUNTER).text = borderTouchingCounter;
    //monitors.automatic();
//    monitors.automatic();
}

Pg.setting = async function () {

    stage.Event.whenFlag(async function(){
        await this.Sound.setOption(Lib.SoundOption.VOLUME, 5);
        secondsCounter = 0;
        monitors.get(SECONDS_COUNTER).text = secondsCounter;
        this.Event.broadcast("START");
    })
    stage.Event.whenBroadcastReceived("START", async function*(){
        while(true) {
            await this.Sound.playUntilDone();
            yield;         
        }
    });
    stage.Event.whenBroadcastReceived("START", async function*(){
        for(;;){
            await this.Control.wait(1);
            secondsCounter+=1;
            monitors.get(SECONDS_COUNTER).text += 1;
            yield;
        }
    });
    ball.Event.whenFlag(async function(){
        this.Motion.setXY(0,0);
        monitors.get(BORDER_TOUCHING_COUNTER).text = 0;
    });

    ball.Event.whenBroadcastReceived("START", async function*(){
        const randomDirection = Lib.randomDirection;
        this.Motion.pointInDirection(randomDirection);
        for(;;){
            this.Motion.moveSteps(5);
            this.Motion.ifOnEdgeBounds();
            if(this.Sensing.isTouchingEdge()){
                monitors.get(BORDER_TOUCHING_COUNTER).text += 1;
            }
            yield;
        }
    });
}