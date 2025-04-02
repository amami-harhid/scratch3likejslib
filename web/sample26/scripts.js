/**
 * sample26
 * 質問を出す
 */

import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample26】リンゴの色に触れたときネコが鳴く"

const Jurassic = "Jurassic";
const Cat01 = "Cat01";

let stage;
let cat;

Pg.preload = async function () {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Image.load('../assets/cat.svg', Cat01 );
}
Pg.prepare = async function () {
//    moveCanvas();
    stage = new Lib.Stage();
    stage.Image.add( Jurassic  )
    cat = new Lib.Sprite( 'cat' );
    await cat.Image.add( Cat01 );

}

Pg.setting = async function () {

    stage.Event.whenClicked(async function() {
        const question = `
STAGE難易度を入力してね
(1 - 3)`;
        console.log(question);
        const answer = await this.Sensing.askAndWait(question);
        console.log(answer);
    });

    cat.Event.whenFlag(async function*(){
    });
    cat.Event.whenClicked(async function(){
        await this.Control.wait(5);
        this.Looks.say("こんにちは")
    });
    cat.Event.whenClicked(async function*(){
        let answer ;
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
