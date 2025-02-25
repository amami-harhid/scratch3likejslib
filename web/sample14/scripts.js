/**
 * Sample14
 * スプライト（CAT) がマウスポインターを追いかける
 * マウスポインターがステージの外に出た最後の位置へ追いかける
 * 5秒経過したら 1秒かけて移動する！に切り替わる
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample14】マウスポインターを追いかける（５秒経過後『１秒間でマウスポインターの位置へ移動する』に変化する）"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";

let stage, cat;

Pg.preload = async function preload( $this ) {
    $this.Image.load('../assets/Jurassic.svg', Jurassic );
    $this.Sound.load('../assets/Chill.wav', Chill );
    $this.Image.load('../assets/cat.svg', Cat );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat = new Lib.Sprite("Cat");
    cat.Motion.gotoXY({x:0, y:0});
    cat.Image.add( Cat );
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function( $this ) {
        // function() の中なので、【this】はstageである。
        await $this.Sound.add( Chill );
        $this.Sound.setOption( Lib.SoundOption.VOLUME, 50);
    });

    stage.Event.whenFlag(async function( $this ) {
        // function() の中なので、【this】はProxy(stage)である。
        $this.Control.forevre(async _=>{
            await $this.Sound.playUntilDone();
        });
    });
    cat.Event.whenFlag(async function( $this ){
        $this.Motion.gotoXY({x:0, y:0});
    })
    // ms の値
    const ms1000 = 1000;
    const ms5000 = 5000;
    // 5秒経過した？
    let _5SecondsTimerOn = false;
    // ネコの速度
    const catStep = 5;
    cat.Event.whenFlag(async function(){
        _5SecondsTimerOn = false;
        await Lib.wait(ms1000+ms5000);
        _5SecondsTimerOn = true;
    });
    cat.Event.whenFlag(async function( $this ){
        // 1秒待ってからマウスカーソルを追跡する
        await Lib.wait(ms1000);
        $this.Control.forever(async _=>{
            // マウスの方向へ向く
            $this.Motion.pointToMouse();
            if(_5SecondsTimerOn){
                // 枠内にあった最後の場所
                const mousePosition = Lib.mousePosition;
                // マウスカーソルの場所へ1秒かけて移動する
                await $this.Motion.glideToPosition( 1, mousePosition.x, mousePosition.y );
            }else{
                $this.Motion.moveSteps(catStep);
            }
    
        });
    });
}