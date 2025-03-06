/**
 * sample23
 * ボールがパドルに触れたら跳ね返る
 */

import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample23】ボールがパドルに触れたら跳ね返る"

const NeonTunnel = "NeonTunnel";
const Chill = "Chill";
const BallA = "BallA";
const Paddle = "Paddle";
const Block = "Block";
const Line = "Line";
const Pew = "Pew";
const YouWon = "YouWon";
const GameOver = "GameOver";

let stage;
let ball, paddle, block, line;
let title;

let score = 0;

Pg.preload = async function () {
    this.Sound.load('../assets/Chill.wav', Chill );
    this.Sound.load('../assets/Pew.wav', Pew);
    this.Image.load('./assets/Neon Tunnel.png', NeonTunnel );
    this.Image.load('./assets/ball-a.svg', BallA );
    this.Image.load('./assets/paddle.svg', Paddle );
    this.Image.load('./assets/button3-b.svg', Block );
    this.Image.load('./assets/line.svg', Line );
    this.Image.load('./assets/YouWon.svg', YouWon );
    this.Image.load('./assets/GameOver.svg', GameOver );
}
Pg.prepare = async function () {
    stage = new Lib.Stage();
    stage.Image.add( NeonTunnel );
    ball = new Lib.Sprite("cat");
    ball.Image.add( BallA );
    //ball.Motion.setXY(0,-100);
    ball.Looks.setSize(50, 50);
    paddle = new Lib.Sprite("paddle");
    paddle.Image.add( Paddle );
    paddle.Motion.setXY(0, -140);
    block = new Lib.Sprite( "block");
    block.Image.add( Block );
//    block.Looks.setSize({x:50, y:50});
    block.Motion.setXY(-220,180);
    block.Looks.hide();
    line = new Lib.Sprite( "line" );
    line.Image.add( Line );
    line.Motion.setXY(0, -170);
    title = new Lib.Sprite("title");
    title.Image.add(YouWon);
    title.Image.add(GameOver);
    title.Looks.hide();
}

Pg.setting = async function () {

    stage.Event.whenFlag(async function*(){
        await this.Sound.add( Chill );
        this.Sound.setOption(Lib.SoundOption.VOLUME, 5);
        while(true) {
            await this.Sound.playUntilDone();
            yield;         
        }
    })
    ball.Event.whenFlag(async function(){
        this.Motion.setXY(0,-100);
    });
    const BallSpeed = 10;
    const InitDirection = 25;
    ball.Event.whenBroadcastReceived('Start', async function(){
        score = 0;
        this.Motion.pointInDirection(InitDirection);
        this.Motion.setXY(0,-100);
        await this.Control.waitUntil(()=>Lib.anyKeyIsDown());
        await this.Control.forever(async ()=>{
            this.Motion.moveSteps(BallSpeed);
            this.Motion.ifOnEdgeBounds();
            if(this.Sensing.isTouchingEdge()){
                const randomDegree = Lib.getRandomValueInRange(-25, 25);
                this.Motion.turnRightDegrees(randomDegree);    
            }
        });
    });
    ball.Event.whenBroadcastReceived('Start', async function(){
        await this.Control.forever(async ()=>{
            if(this.Sensing.isTouchingTarget(block)){
                this.Motion.turnRightDegrees( Lib.getRandomValueInRange(-5, 5)+180 );
            }
        });
    });
    ball.Event.whenBroadcastReceived('Start', async function(){
        await this.Control.forever(async ()=>{
            if(this.Sensing.isTouchingTarget(paddle)){
                this.Motion.turnRightDegrees( Lib.getRandomValueInRange(-2, 2)+180 );
                this.Motion.moveSteps(BallSpeed*2);
                await Lib.wait(0.2 * 1000);
            }
        });
    });
    line.Event.whenFlag(async function*(){
        while(true){
            if( this.Sensing.isTouchingTarget(ball)){
                // Ball に触れたとき
                this.Event.broadcast(GameOver);
                Lib.Loop.break();
            }
            yield;
        }
    });
    paddle.Event.whenBroadcastReceived('Start', async function*(){
        while(true){
            const mousePos = Lib.mousePosition;
            const selfPosition = this.Motion.getCurrentPosition();
            this.Motion.moveTo(mousePos.x, selfPosition.y);
            yield;
        }

    });
    let blockCount;
    block.Event.whenFlag(async function*(){
        await this.Sound.add(Pew);
        this.Looks.setSize({x:50, y:50});
        const pos = this.Motion.getCurrentPosition();
        const demension = this.Looks.drawingDimensions();
        blockCount = 0;
        for(let y=0; y<3; y++){
            for(let x=0; x<3; x++){
                const blkPos = { x: pos.x + x*demension.width, y: pos.y + (-y)*demension.height };
                await this.Control.clone({position: blkPos});
                yield;
            }
            yield;
        }
        this.Event.broadcast('Start');
    });

    block.Control.whenCloned(async function*(){
        blockCount+=1;
        this.Looks.show();
        while(true){
            if(this.Sensing.isTouchingTarget(ball)){
                score += 1;
                this.Sound.play();
                this.Looks.hide();
                break;
            }    
            yield;            
        }
        if(score == blockCount) {
            this.Event.broadcast(YouWon);
        }
        this.Control.remove();
    })
    title.Event.whenFlag(async function(){
        this.Looks.hide();
    })
    title.Event.whenBroadcastReceived(YouWon, async function(){
        title.Looks.switchCostume(YouWon);
        title.Looks.show();
        Pg.Control.stopAll();
    });
    title.Event.whenBroadcastReceived(GameOver, async function(){
        title.Looks.switchCostume(GameOver);
        title.Looks.show();
        Pg.Control.stopAll();
    });
}