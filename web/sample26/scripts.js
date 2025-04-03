/**
 * sample26
 * 質問を出す
 */

import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample26】質問をする"

const Jurassic = "Jurassic";
const Cat01 = "Cat01";
const Chill = "Chill";
let stage;
let cat;

Pg.preload = async function () {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
    this.Image.load('../assets/cat.svg', Cat01 );
}
Pg.prepare = async function () {
//    moveCanvas();
    stage = new Lib.Stage();
    await stage.Image.add( Jurassic  );
    await stage.Sound.add( Chill );
    cat = new Lib.Sprite( 'cat' );
    await cat.Image.add( Cat01 );

}

Pg.setting = async function () {

    stage.Event.whenFlag( async function(){ 
        console.log('STAGE WHENFLAG');
        this.Event.broadcast('START');
    });

    /**
     * メッセージ(START)を受け取ったときの動き
     */
    stage.Event.whenBroadcastReceived('START', async function*(){
        console.log('START');
        // 音量 100
        await this.Sound.setOption( Lib.SoundOption.VOLUME, 100 );
        // 「終わるまで音を鳴らす」をずっと繰り返す
        while(true){
            console.log('WHILE');
            // 処理が終わるまで待つために await をつける
            await this.Sound.playUntilDone(Chill);
            await this.Sound.changeOptionValue(Lib.SoundOption.VOLUME, -10);
            await this.Sound.changeOptionValue(Lib.SoundOption.PITCH, 10);
            yield;
        }
    })
    // stage click で broadcast 内のループが止まる？？
    stage.Event.whenClicked(async function() {
        const question = `
STAGE難易度を入力してね
(1 - 3)`;
        console.log(question);
        const answer = await this.Sensing.askAndWait(question);
        console.log(answer);
    });

    cat.Event.whenFlag(async function*(){
        await this.Control.wait(20);
        this.Looks.say('');
        console.log('SAY')
        for(;;){
            console.log(`mouseX=${this.Sensing.Mouse.x}, mouseY=${this.Sensing.Mouse.y}`);
            yield;
        }

    })
    cat.Event.whenClicked(async function*(){
        console.log('cat click1');
        await this.Control.wait(1);
//        this.Looks.say("こんにちは")
        this.Motion.gotoXY(100,100);
        console.log(`x=${this.Motion.Position.x}, y=${this.Motion.Position.y}`);
        await this.Control.wait(1);
        this.Motion.Position.x = 50;
        console.log(`x=${this.Motion.Position.x}, y=${this.Motion.Position.y}`);
        await this.Control.wait(1);
        this.Motion.gotoXY(150,150);
        console.log(`x=${this.Motion.Position.x}, y=${this.Motion.Position.y}`);
        await this.Control.wait(1);
        this.Motion.gotoXY(0,0);
        let degree = 90;
        for(;;){
            degree += 1;
            this.Motion.Direction.degree -= 1;
            //this.Motion.pointInDerection(degree);
            yield;
        }
    });
    cat.Event.whenClicked(async function*(){
        console.log('cat click2');        let answer ;
        for(;;){
            const question = `
難易度を入力してね
(1 - 3)
            `;
            answer = await this.Sensing.askAndWait(question);
            if(answer == '1' || answer == '2' || answer == '3') {
                break;
            }
            await this.Looks.sayForSecs(`${answer}はだめだよ`, 1)
            await this.Looks.sayForSecs('やり直してね', 1)
            yield;
        }
        await this.Looks.sayForSecs('ＯＫ', 1)
        const text = `難易度は${answer}だよ`; 
        console.log(text);
        this.Looks.say(text);

    });
}
