/**
 * Sample14
 * スプライト（CAT) がマウスポインターを追いかける
 * マウスポインターがステージの外に出た最後の位置へ追いかける
 * 5秒経過したら 1秒かけて移動する！に切り替わる
 */
import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample14】マウスポインターを追いかける（５秒経過前後で動きが変わります）"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.position.x = 0;
    St.cat.position.y = 0;
    St.cat.addImage( Images.Cat );
}

Pg.setting = async function setting() {

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    // 5秒経過した？
    let _5SecondsTimerOn = false;
    // ネコの速度
    const catStep = 5;
    St.cat.whenFlag(async function(){
        _5SecondsTimerOn = false;
        await Libs.wait(5000);
        _5SecondsTimerOn = true;
    });

    St.cat.whenFlag(async function(){
        // 1秒待ってからマウスカーソルを追跡する
        await Libs.wait(1000);
        this.while(true, async _=>{
            // マウスの方向へ向く
            this.pointToMouse();
            if(_5SecondsTimerOn){
                // 枠内にあった最後の場所
                const mousePosition = Libs.mousePosition;
                // マウスカーソルの場所へ1秒かけて移動する
                await this.glideToPosition( 1, mousePosition.x, mousePosition.y );
            }else{
                this.moveSteps(catStep);
            }
    
        });
    });
}