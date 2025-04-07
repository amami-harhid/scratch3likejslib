/**
 * sample28
 * 質問を出す
 */

import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample28】質問をする(ネコをクリック、ステージをクリック)"

const Jurassic01 = "Jurassic01";
const Chill = "Chill";
const Cat01 = "Cat01";
const Cat02 = "Cat02";

let stage;
let cat;
const AssetHost = "https://amami-harhid.github.io/scratch3likejslib/web";

Pg.preload = async function preload() {
    this.Image.load(AssetHost+'/assets/Jurassic.svg', Jurassic01 );
    this.Sound.load(AssetHost+'/assets/Chill.wav', Chill );
    this.Image.load(AssetHost+'/assets/cat.svg', Cat01 );
    this.Image.load('./assets/blackCat.svg', Cat02 );
}
Pg.prepare = async function prepare() {

    // ステージを作る
    stage = new Lib.Stage();
    // ステージに背景を追加
    await stage.Image.add( Jurassic01 );
    // Chill を追加
    await stage.Sound.add( Chill );

    // スプライト(ネコ)を作る
    cat = new Lib.Sprite("cat");
    // コスチュームを追加
    await cat.Image.add( Cat01 );
    await cat.Image.add( Cat02 );
}

Pg.setting = async function setting() {

    /**
     * 旗を押されたときの動き
     * STARTメッセージを送る
     */
    cat.Event.whenFlag(async function*(){
        this.Looks.switchCostume(Cat01);
        await this.Looks.sayForSecs('ステージやネコをクリックすると質問をするよ',1);
        await this.Looks.sayForSecs('連続してクリックすると前回の質問応答の後に質問が続くよ',1);
        await this.Looks.sayForSecs('答えはコンソールへ出力するよ',1);
        this.Looks.say('');
        // メッセージを送る
        this.Event.broadcast('START');
        // ずっと繰り返す
        for(;;){
            // 向きを +1 する
            this.Motion.Direction.degree += 1;
            yield;
        }
    });
    stage.Event.whenFlag(async function(){
        // 4秒後に「ステージの他のスクリプトを止める」
        await this.$waitSeconds(10);
        console.log('Stage stopOtherScripts')
        this.Control.stopOtherScripts();
    })

    stage.Event.whenFlag(async function*(){
        // 音量 10
        await this.Sound.setOption(Lib.SoundOption.VOLUME, 50);
        await this.Sound.setOption(Lib.SoundOption.PITCH, -50);
        // ずっと繰り返す
        for(;;){
            // 終わるまで音を鳴らす
            //await this.Sound.playUntilDone(Chill);
            this.Sound.play(Chill);
            await this.Control.wait(1);
            yield;
        }
    })

    /**
     * STARTを受け取ったときの動き（ステージ） 
     */ 
    stage.Event.whenBroadcastReceived('START', async function*(){
        // 音量 10
        await this.Sound.setOption(Lib.SoundOption.VOLUME, 150);
        // ずっと繰り返す
        for(;;){
            console.log('playUntilDone(Chill)')
            // 終わるまで音を鳴らす
            await this.Sound.playUntilDone(Chill);
            yield;
        }
    })
    /**
     * STARTを受け取ったときの動き（ステージ） 
     */ 
    stage.Event.whenBroadcastReceived('START', async function(){
        // STARTを受け取ったら クリックの動きを始める
        this.Event.whenClicked(async function(){
            const answer = await this.Sensing.askAndWait('ステージから質問をするよ');
            await this.Event.broadcastAndWait('ANSWER', answer, "ステージ");
        });
    });

    /**
     * STARTを受け取ったときの動き（ネコ） 
     */ 
    cat.Event.whenBroadcastReceived('START', async function(){
        // STARTを受け取ったら クリックの動きを始める
        this.Event.whenClicked(async function(){
            const answer = await this.Sensing.askAndWait('ネコから質問をするよ');
            await this.Event.broadcastAndWait('ANSWER', answer, "ネコ");
        });
    });

    /**
     * STARTを受け取ったときの動き（ネコ） 
     */ 
    cat.Event.whenBroadcastReceived('START', async function*(){
        this.Looks.switchCostume(Cat02);
        this.Looks.Size.w = -200;
        this.Looks.Size.h = -200;
        for(;;){
            for(const _ of Lib.Iterator(40)){
                this.Looks.Size.w += 10;
                this.Looks.Size.h += 5;
                if(this.Looks.Size.w < 0) {
                    this.Looks.switchCostume(Cat02);
                }else{
                    this.Looks.switchCostume(Cat01);
                }
                yield;
            }
            for(const _ of Lib.Iterator(40)){
                this.Looks.Size.w -= 10;
                this.Looks.Size.h -= 5;
                if(this.Looks.Size.w < 0) {
                    this.Looks.switchCostume(Cat02);
                }else{
                    this.Looks.switchCostume(Cat01);
                }
                yield;
            }
            yield;
        }
    });
    
    /**
     * ANSWERを受け取ったときの動き（ネコ） 
     */ 
    cat.Event.whenBroadcastReceived('ANSWER', async function(answer, from){
        // 1秒間、答えを考える。
        const message = `${from}の質問への答えは 『${answer}』でした`;
        console.log(message);
        await this.Looks.thinkForSecs(message, 1);
    });
}
