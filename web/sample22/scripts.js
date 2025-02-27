/**
 * Sample22
 * Scratch3 スピーチの実験
 * 
 * sample21では、音声スピーチを broadcast を経由していますが、
 * broadcastAndWait にて音声スピーチが終わりを検知できるようにしました。
 * 
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample22】スピーチ機能：「スピーチを終わるまで待つ」の確認";

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";
const Nya = "Nya";

let stage, cat;

Pg.preload = async function preload( $this ) {

    $this.Image.load('../assets/Jurassic.svg', Jurassic );
    $this.Sound.load('../assets/Chill.wav', Chill );
    $this.Image.load('../assets/cat.svg', Cat );
    $this.Sound.load('../assets/Cat.wav', Nya );
}
Pg.prepare = async function prepare() {

    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat = new Lib.Sprite( "Cat" );
    cat.Looks.setSize( {x:300,y:300} );//サイズを３倍にしています
    cat.Image.add( Cat );
    cat.Sound.add( Nya );
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function(){
        await this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 20 )
        await this.Control.forever( async _=>{
            await this.Sound.playUntilDone();
        });
    })

    cat.Event.whenFlag( async function(){
        this.Control.forever( async _=>{
            await this.Sound.playUntilDone();
        });
    });
    
    // ネコにさわったらお話する
    cat.Event.whenFlag( async function(){
        const words = `なになに？`;
        const properties = {'pitch': 2, 'volume': 100}
        this.C.forever( async _=>{
            if( this.Sensing.isMouseTouching() ) {
                this.Looks.say(words);// フキダシを出す
                await this.Event.broadcastAndWait('SPEECH', words, properties, 'male');
                this.Looks.say(""); // フキダシを消す
                // 「送って待つ」を使うことで スピーチが終わるまで次のコードに進まない。
                // スピーチは２つ同時にできないので、スプライトクリックのイベントと重なってしまう。
                // 以下の「マウスタッチしている間、待つ」をして 「なになに？」のスピーチ開始を一旦とめる。
                await Lib.waitWhile( ()=>this.Sensing.isMouseTouching()); 
            }else{
                await this.Event.broadcastAndWait('SPEECH_STOP');
            }
        });
    });
    // ネコをクリックしたらお話する
    cat.Event.whenClicked(async function( ){
        const words = `そこそこ。そこがかゆいの。`;
        const properties = {'pitch': 1.7, 'volume': 500}
        // スピーチを止めるためのメッセージを送る
        await this.Event.broadcastAndWait('SPEECH_STOP');
        // スピーチさせるメッセージを送る
        await this.Event.broadcastAndWait('SPEECH', words, properties, 'female');
    });
    
    /** スピーチのメッセージを受信したとき */
    cat.Event.whenBroadcastReceived('SPEECH', async function(words, properties, gender='male', locale='ja-JP') {
        // speechAndWait に await をつけて、音声スピーチが終わるまで待つ。
        await this.Extensions.speechAndWait(words, properties, gender, locale);
    });
    /** スピーチ停止のメッセージを受信したとき */
    cat.Event.whenBroadcastReceived('SPEECH_STOP', async function() {
        // スピーチを全て停止する
        this.Extensions.speechStopAll();
    });

}