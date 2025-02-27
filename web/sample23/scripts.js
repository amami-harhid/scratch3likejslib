/**
 * sample23
 * ボールがパドルに触れたら跳ね返る
 */

// Size変更した直後のdrawingDimensionsは変更適用後を取得できない
// これはバグかも。--> スレッド１回ループしたら適用されるっぽい。
// Size変更時は update() をかけるべきかも。

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

Pg.preload = async function preload($this) {
    $this.Sound.load('../assets/Chill.wav', Chill );
    $this.Sound.load('../assets/Pew.wav', Pew);
    $this.Image.load('./assets/Neon Tunnel.png', NeonTunnel );
    $this.Image.load('./assets/ball-a.svg', BallA );
    $this.Image.load('./assets/paddle.svg', Paddle );
    $this.Image.load('./assets/button3-b.svg', Block );
    $this.Image.load('./assets/line.svg', Line );
    $this.Image.load('./assets/YouWon.svg', YouWon );
    $this.Image.load('./assets/GameOver.svg', GameOver );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( NeonTunnel );
    ball = new Lib.Sprite("cat");
    ball.Image.add( BallA );
    ball.Motion.setXY(0,-100);
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

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function($this){
        await $this.Sound.add( Chill );
        $this.Sound.setOption(Lib.SoundOption.VOLUME, 5);
        await $this.Control.while(true, async ()=>{
            await $this.Sound.playUntilDone();
        });
    })
    const BallSpeed = 10;
    const InitDirection = 25;
    ball.Event.whenBroadcastReceived('Start', async function(){
        const $this = ball;
        score = 0;
        $this.Motion.pointInDirection(InitDirection);
        $this.Motion.setXY(0,-100);
        await $this.Control.waitUntil(()=>Lib.anyKeyIsDown());
        await $this.Control.forever(async ()=>{
            $this.Motion.moveSteps(BallSpeed);
            $this.Motion.ifOnEdgeBounds();
            if($this.Sensing.isTouchingEdge()){
                const randomDegree = Lib.getRandomValueInRange(-25, 25);
                $this.Motion.turnRightDegrees(randomDegree);    
            }
        });
    });
    ball.Event.whenBroadcastReceived('Start', async function(){
        const $this = ball;
        await $this.Control.forever(async ()=>{
            if($this.Sensing.isTouchingTarget(block)){
                $this.Motion.turnRightDegrees( Lib.getRandomValueInRange(-5, 5)+180 );
            }
        });
    });
    ball.Event.whenBroadcastReceived('Start', async function(){
        const $this = ball;
        await $this.Control.forever(async ()=>{
            if($this.Sensing.isTouchingTarget(paddle)){
                $this.Motion.turnRightDegrees( Lib.getRandomValueInRange(-2, 2)+180 );
                $this.Motion.moveSteps(BallSpeed*2);
                await Lib.wait(0.2 * 1000);
            }
        });
    });
    line.Event.whenFlag(async function($this){
        await $this.Control.forever(async ()=>{
            if( $this.Sensing.isTouchingTarget(ball)){
                // Ball に触れたとき
                $this.Event.broadcast(GameOver);
                Lib.Loop.break();
            }
        });
    });
    paddle.Event.whenBroadcastReceived('Start', async function(){
        console.log('paddle start')
        const $this = paddle;
        // whenBroadcastReceivedのなかで foreverが使えない様子
        // whenFlagなどの中では使える。バグです。
        await $this.Control.forever(async ()=>{
            const mousePos = Lib.mousePosition;
            const selfPosition = $this.Motion.getCurrentPosition();
            $this.Motion.moveTo(mousePos.x, selfPosition.y);
            //const ballPosition = ball.Motion.getCurrentPosition();
            //$this.Motion.moveTo(ballPosition.x, selfPosition.y);
        });

    });
    let blockCount = 0;
    block.Event.whenFlag(async ($this)=>{
        await $this.Sound.add(Pew);
        $this.Looks.setSize({x:50, y:50});
        const pos = $this.Motion.getCurrentPosition();
        const demension = $this.Looks.drawingDimensions();
        let y=0;
        blockCount = 0;
        await $this.Control.repeat(3, async ()=>{
            let x=0;
            await $this.Control.repeat(10, async ()=>{
                const blkPos = { x: pos.x + x*demension.width, y: pos.y + (-y)*demension.height };
                await $this.Control.clone({position: blkPos});
                x+=1;
            });
            y+=1;
        });
        $this.Event.broadcast('Start');
    });

    block.Control.whenCloned(async ($this)=>{
        blockCount+=1;
        $this.Looks.show();
        await $this.Control.forever(async ()=>{
            if($this.Sensing.isTouchingTarget(ball)){
                score += 1;
                //console.log('Touching score='+score);
                $this.Sound.play();
                $this.Looks.hide();
                Lib.Loop.break();
            }    
        })
        if(score == blockCount) {
            $this.Event.broadcast(YouWon);
        }
        $this.Control.remove();
    })
    title.Event.whenFlag(async ($this)=>{
        $this.Looks.hide();
    })
    title.Event.whenBroadcastReceived(YouWon, async ()=>{
        title.Looks.switchCostume(YouWon);
        title.Looks.show();
        Pg.Control.stopAll();
    });
    title.Event.whenBroadcastReceived(GameOver, async ()=>{
        title.Looks.switchCostume(GameOver);
        title.Looks.show();
        Pg.Control.stopAll();
    });
}