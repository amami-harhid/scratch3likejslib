/**
 * Sample08
 * スプライトを 動かす( 端に触れたら ミャーと鳴く)
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample08】スプライトが動き、端に触れたらミャーと鳴く"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";
const Mya = "Mya";

let stage, cat;

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Sound.load('../assets/Chill.wav', Chill);
    this.Image.load('../assets/cat.svg', Cat);
    this.Sound.load('../assets/Cat.wav', Mya);
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    
    cat = new Lib.Sprite("Cat");
    cat.Image.add( Cat );
}
Pg.setting = async function setting() {

    stage.Event.whenFlag(async $stage=>{
        // ここでの『this』は P であるので、this.sounds は P.soundsと同じである。 
        // stageのインスタンスは 『stage』の変数で受け取っている。
        await $stage.Sound.add( Chill );
        $stage.Sound.setOption( Lib.SoundOption.VOLUME, 10 );
        await $stage.C.forever(async _=>{
            // ＢＧＭを鳴らし続ける（終わるまで待つ）
            await $stage.Sound.playUntilDone();
        })
    });

    const catStep = 20;

    cat.Event.whenFlag( async _cat=>{
        await _cat.Sound.add( Mya );
        _cat.Sound.setOption( Lib.SoundOption.VOLUME, 10);
    });
    
    cat.Event.whenFlag( async _cat=> {
        // 初期化
        _cat.M.gotoXY({x:0, y:0});
        _cat.M.pointInDirection( 50 );
    });

    // 課題
    // ifOnEdgeBounds()のときに KeepInFence による
    // 移動が足りていないと思われる。横向きに動くとき +1 してやると
    // ちょうどよい感じがする( Ball のとき )
    // Cat のときと Ball のときの動きの違い、どこに原因があるのかを
    // 調べるとよさそう。

    cat.Event.whenFlag( async _cat=>{
        // ずっと「左右」に動く。端に触れたら跳ね返る。
        _cat.C.forever( _=> {
            _cat.Motion.moveSteps(catStep);
            _cat.Motion.ifOnEdgeBounds();
            if(_cat.Sensing.isTouchingEdge()){
                //_cat.Motion.moveSteps(+1);
                _cat.Sound.play();
                // const randomDegree = Lib.getRandomValueInRange(-50, 50);
                // _cat.Motion.turnRightDegrees(randomDegree);    
            }
        });
    });


}