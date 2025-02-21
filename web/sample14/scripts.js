/**
 * Sample14
 * スプライト（CAT) がマウスポインターを追いかける
 * マウスポインターがステージの外に出た最後の位置へ追いかける
 * 5秒経過したら 1秒かけて移動する！に切り替わる
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample14】マウスポインターを追いかける（５秒経過後『１秒間でマウスポインターの位置へ移動する』に変化する）"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.Motion.gotoXY({x:0, y:0});
    St.cat.Image.add( Images.Cat );
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.C.while(true, async _=>{
            await this.Sound.playUntilDone();
        });
    });
    St.cat.Event.whenFlag(async function(){
        this.Motion.gotoXY({x:0, y:0});
    })
    // ms の値
    const ms1000 = 1000;
    const ms5000 = 5000;
    // 5秒経過した？
    let _5SecondsTimerOn = false;
    // ネコの速度
    const catStep = 5;
    St.cat.Event.whenFlag(async function(){
        _5SecondsTimerOn = false;
        await Libs.wait(ms1000+ms5000);
        _5SecondsTimerOn = true;
    });
    St.cat.Event.whenFlag(async function(){
        // 1秒待ってからマウスカーソルを追跡する
        await Libs.wait(ms1000);
        this.C.while(true, async _=>{
            // マウスの方向へ向く
            this.Motion.pointToMouse();
            if(_5SecondsTimerOn){
                // 枠内にあった最後の場所
                const mousePosition = Libs.mousePosition;
                // マウスカーソルの場所へ1秒かけて移動する
                await this.Motion.glideToPosition( 1, mousePosition.x, mousePosition.y );
            }else{
                this.Motion.moveSteps(catStep);
            }
    
        });
    });
}