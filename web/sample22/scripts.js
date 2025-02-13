/**
 * Sample22
 * Scratch3 スピーチの実験
 * 
 * sample21では、音声スピーチを broadcast を経由していますが、
 * broadcastAndWait にて音声スピーチが終わりを検知できるようにしました。
 * 
 * 【課題】
 * ネコを何度もクリックすると 音声スピーチが被って聞こえます。
 * 音声スピーチを途中でキャンセルしたいところだが、仕組み検討します。
 * 
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat", {scale:{x:200,y:200}});//サイズを２倍にしています
    P.cat.addImage( P.images.Cat );
}

P.setting = async function setting() {

    P.stage.whenFlag(async function(){
        await this.addSound( P.sounds.Chill, { 'volume' : 20 } );
        await this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    })
    
    // ネコにさわったらお話する
    P.cat.whenFlag( async function(){
        this.__waitTouching = false;
        const words = `なになに？どうしたの？`;
        const properties = {'pitch': 2, 'volume': 100}
        this.while(true, async _=>{
            if( this.isMouseTouching() ) {
                this.say(words);
                await this.broadcastAndWait('SPEECH', words, properties, 'male');
                
                // 「送って待つ」を使うことで スピーチが終わるまで次のループに進まないため、
                // 以下の「マウスタッチしない迄待つ」のコードが不要である。
                //await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace,  this ); 
            }else{
                this.say(""); // フキダシを消す
            }
        });
    });
    // ネコをクリックしたらお話する
    P.cat.whenClicked(async function(){
        const words = `そこそこ。そこがかゆいの。`;
        const properties = {'pitch': 1.7, 'volume': 500}
        await this.broadcastAndWait('SPEECH', words, properties, 'female')
    });
    
    P.cat.whenBroadcastReceived('SPEECH', async function(words, properties, gender='male', locale='ja-JP') {
        // speechAndWait に await をつけて、音声スピーチが終わるまで待つ。
        await this.speechAndWait(words, properties, gender, locale);

    });

}