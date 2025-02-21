/**
 * Sample50 setting
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

export async function setting() {

    St.stage.Event.whenFlag(async function(){
        await this.Sound.add( Sounds.Chill, { 'volume' : 20 } );
        await this.C.forever( async _=>{
            await this.Sound.playUntilDone();
        });
    })
    
    // ネコにさわったらお話する
    St.cat.Event.whenFlag( async function(){
        this.__waitTouching = false;
        const words = `なになに？どうしたの？`;
        const properties = {'pitch': 2, 'volume': 100}
        this.C.forever( async _=>{
            if( this.Sensing.isMouseTouching() ) {
                this.Looks.say(words);
                await this.Event.broadcastAndWait('SPEECH', words, properties, 'male');
                
                // 「送って待つ」を使うことで スピーチが終わるまで次のループに進まないため、
                // 以下の「マウスタッチしている間、待つ」のコードが不要である。
                //await Libs.waitWhile( ()=>this.isMouseTouching()); 
            }else{
                this.Looks.say(""); // フキダシを消す
            }
        });
    });
    // ネコをクリックしたらお話する
    let catSpeeking = false;
    St.cat.Event.whenClicked(async function(){
        const words = `そこそこ。そこがかゆいの。`;
        const properties = {'pitch': 1.7, 'volume': 500}
        if(catSpeeking === false){
            catSpeeking = true;
            await this.Event.broadcastAndWait('SPEECH', words, properties, 'female');
            catSpeeking = false;
        }
    });
    
    St.cat.Event.whenBroadcastReceived('SPEECH', async function(words, properties, gender='male', locale='ja-JP') {
        // speechAndWait に await をつけて、音声スピーチが終わるまで待つ。
        await this.Extensions.speechAndWait(words, properties, gender, locale);
    });

}