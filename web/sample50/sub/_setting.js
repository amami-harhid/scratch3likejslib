/**
 * Sample50 setting
 */
import {PlayGround, Library} from '../../../build/index.js'

const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする
import {Chill} from '../def/constants.js';
import {Obj} from '../def/variables.js';

export async function setting() {

    Obj.stage.Event.whenFlag(async function*(){
        await this.Sound.add( Chill );
        await this.Sound.setOption(Lib.SoundOption.VOLUME, 20);
        for(;;){
            await this.Sound.playUntilDone();
            yield;
        }
    })
    
    // ネコにさわったらお話する
    Obj.cat.Event.whenFlag( async function*(){
        this.__waitTouching = false;
        const words = `なになに？どうしたの？`;
        const properties = {'pitch': 2, 'volume': 100}
        for(;;){
            if( this.Sensing.isMouseTouching() ) {
                this.Looks.say(words);
                await this.Event.broadcastAndWait('SPEECH', words, properties, 'male');
                
                // 「送って待つ」を使うことで スピーチが終わるまで次のループに進まないため、
                // 以下の「マウスタッチしている間、待つ」のコードが不要である。
                //await Lib.waitWhile( ()=>this.isMouseTouching()); 
            }else{
                this.Looks.say(""); // フキダシを消す
            }
            yield;
        }
    });
    // ネコをクリックしたらお話する
    let catSpeeking = false;
    Obj.cat.Event.whenClicked(async function(){
        const words = `そこそこ。そこがかゆいの。`;
        const properties = {'pitch': 1.7, 'volume': 500}
        if(catSpeeking === false){
            catSpeeking = true;
            await this.Event.broadcastAndWait('SPEECH', words, properties, 'female');
            catSpeeking = false;
        }
    });
    
    Obj.cat.Event.whenBroadcastReceived('SPEECH', async function(words, properties, gender='male', locale='ja-JP') {
        // speechAndWait に await をつけて、音声スピーチが終わるまで待つ。
        await this.Extensions.speechAndWait(words, properties, gender, locale);
    });

}