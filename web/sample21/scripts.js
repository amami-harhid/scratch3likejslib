/**
 * Sample21
 * Scratch3 スピーチの実験
 * 
 * Scratch3のスピーチは 次の仕組みです
 * 
 * https://github.com/scratchfoundation/scratch-vm/blob/develop/src/extensions/scratch3_text2speech/index.js#L742
 *
 * (1) URL を組み立てる
 * (2) fetchして音をGETする
 * (3) 音を soundPlayer に食わせて
 * (4) ピッチや音量を与えて 再生する
 * (5) soundPlayer.play() の中で stop を EMIT している。それを受けて SoundPlayerをdeleteしている。
 * 
 * ■ ja-JP, male, あいうえお 
 * https://synthesis-service.scratch.mit.edu/synth?locale=ja-JP&gender=male&text=%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A
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
    P.cat = new P.Sprite("Cat");
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
        const words = `おっと`;
        const properties = {'pitch': 2, 'volume': 100}
        this.while(true, async _=>{
            if( this.isMouseTouching() ) {
                this.broadcast('SPEAK', words, properties, 'male');
                
                // 「送って待つ」ではないので次のループに進ませないように、
                // 「マウスタッチしない迄待つ」をする。
                await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace,  this ); 
            }
        });
    });
    // ネコをクリックしたらお話する
    P.cat.whenClicked(function(){
        const words = `そこそこ`;
        const properties = {'pitch': 1.7, 'volume': 500}
        this.broadcast('SPEAK', words, properties, 'female')
    });
    
    P.cat.whenBroadcastReceived('SPEAK', async function(words, properties, gender='male', locale='ja-JP') {

        this.speech(words, properties, gender, locale);

    });

}