/**
 * Sample22
 * Scratch3 スピーチの実験
 * 
 * sample21では、音声スピーチを broadcast を経由していますが、
 * broadcastAndWait にて音声スピーチが終わりを検知できるようにしました。
 * 
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample22】スピーチ機能：「お話しを終わるまで待つ」を続ける"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat", {scale:{x:200,y:200}});//サイズを２倍にしています
    St.cat.Image.add( Images.Cat );
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function(){
        await this.Sound.add( Sounds.Chill, { 'volume' : 20 } );
        await this.C.forever( async _=>{
            await this.Sound.playUntilDone();
        });
    })
    
    // ネコにさわったらお話する
    St.cat.Event.whenFlag( async function(){
        this.__waitTouching = false;
        const words = `なになに？なになに？なになに？`;
        const properties = {'pitch': 2, 'volume': 100}
        this.C.forever( async _=>{
            if( this.Sensing.isMouseTouching() ) {
                this.Looks.say(words);
                await this.Event.broadcastAndWait('SPEECH', words, properties, 'male');
                // 「送って待つ」を使うことで スピーチが終わるまで次のコードに進まない。
                // スピーチは２つ同時にできないので、スプライトクリックのイベントと重なってしまう。
                // 以下の「マウスタッチしている間、待つ」をして 「なになに？」のスピーチ開始を一旦とめる。
                await Libs.waitWhile( ()=>this.Sensing.isMouseTouching()); 
            }else{
                this.Looks.say(""); // フキダシを消す
            }
        });
    });
    // ネコをクリックしたらお話する
    St.cat.Event.whenClicked(async function(){
        const words = `そこそこ。そこがかゆいの。`;
        const properties = {'pitch': 1.7, 'volume': 500}
        await this.Event.broadcastAndWait('SPEECH', words, properties, 'female');
    });
    
    St.cat.Event.whenBroadcastReceived('SPEECH', async function(words, properties, gender='male', locale='ja-JP') {
        // speechAndWait に await をつけて、音声スピーチが終わるまで待つ。
        await this.Extensions.speechAndWait(words, properties, gender, locale);
    });
    St.cat.Event.whenBroadcastReceived('SPEECH_STOP', async function() {
        // スピーチを停止する
        this.Extensions.speechStopImmediately();
    });

}