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
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample21】スピーチ機能：ネコに触る、タッチするとお話しをする"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Lib.Sprite("Cat");
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
        const words = `おっと`;
        const properties = {'pitch': 2, 'volume': 100}
        this.C.forever( async _=>{
            if( this.Sensing.isMouseTouching() ) {
                this.Event.broadcast('SPEAK', words, properties, 'male');
                
                // 「送って待つ」ではないので次のループに進ませないように、
                // 「マウスタッチしない迄待つ」をする。
                await Lib.waitWhile( _=>this.Sensing.isMouseTouching() ); 
            }
        });
    });
    // ネコをクリックしたらお話する
    St.cat.Event.whenClicked(function(){
        const words = `そこそこ`;
        const properties = {'pitch': 1.7, 'volume': 500}
        this.Event.broadcast('SPEAK', words, properties, 'female')
    });
    
    St.cat.Event.whenBroadcastReceived('SPEAK', async function(words, properties, gender='male', locale='ja-JP') {

        this.Extensions.speech(words, properties, gender, locale);

    });

}