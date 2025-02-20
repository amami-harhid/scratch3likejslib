/**
 * Sample08
 * スプライトを 動かす( 端に触れたら ミャーと鳴く)
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample08】スプライトが動き、端に触れたらミャーと鳴く"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage();
    St.stage.addImage( Images.Jurassic );
    
    St.cat = new Libs.Sprite("Cat");
    St.cat.addImage( Images.Cat );
}
Pg.setting = async function setting() {

    St.stage.whenFlag(async stage=>{
        // ここでの『this』は P であるので、this.sounds は P.soundsと同じである。 
        // stageのインスタンスは 『stage』の変数で受け取っている。
        await stage.addSound( Sounds.Chill, { 'volume' : 50 } );
        await stage.while(true, async _=>{
            // ＢＧＭを鳴らし続ける（終わるまで待つ）
            await stage.startSoundUntilDone();
        })
    });

    const catStep = 10;

    St.cat.whenFlag( async _cat=>{
        _cat.addSound( Sounds.Mya, { 'volume' : 50 } );
    });
    
    St.cat.whenFlag( async cat=> {
        // 初期化
        cat.position = {x:0, y:0};
        cat.direction = 90;
    });

    St.cat.whenFlag( async _cat=>{
        // ずっと「左右」に動く。端に触れたら跳ね返る。
        _cat.while( true, _=> {
            _cat.moveSteps(catStep);
            _cat.ifOnEdgeBounds();
            if(_cat.isTouchingEdge()){
                _cat.soundPlay()
            }
        });
    });


}