/**
 * Sample08
 * スプライトを 動かす( 端に触れたら ミャーと鳴く)
 */
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample08】スプライトが動き、端に触れたらミャーと鳴く"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
    this.Sound.load('../assets/Cat.wav','Mya');
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );
    
    St.cat = new Lib.Sprite("Cat");
    St.cat.Image.add( Images.Cat );
}
Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async stage=>{
        // ここでの『this』は P であるので、this.sounds は P.soundsと同じである。 
        // stageのインスタンスは 『stage』の変数で受け取っている。
        await stage.Sound.add( Sounds.Chill, { 'volume' : 50 } );
        await stage.C.forever(async _=>{
            // ＢＧＭを鳴らし続ける（終わるまで待つ）
            await stage.Sound.playUntilDone();
        })
    });

    const catStep = 10;

    St.cat.Event.whenFlag( async _cat=>{
        _cat.Sound.add( Sounds.Mya, { 'volume' : 50 } );
    });
    
    St.cat.Event.whenFlag( async cat=> {
        // 初期化
        cat.M.gotoXY({x:0, y:0});
        cat.M.pointInDirection( 90 );
    });

    St.cat.Event.whenFlag( async _cat=>{
        // ずっと「左右」に動く。端に触れたら跳ね返る。
        _cat.C.forever( _=> {
            _cat.Motion.moveSteps(catStep);
            _cat.Motion.ifOnEdgeBounds();
            if(_cat.Sensing.isTouchingEdge()){
                _cat.Sound.play();
            }
        });
    });


}