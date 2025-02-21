/**
 * Sample17
 * スプライト（CROSS) : 右側に回転 、マウスポインターに触れたら 蝶のクローンを作る（クローンの位置はマウスポインターの位置）
 * スプライト（butterfly) : 非表示、クローンされたら表示に切り替える、クローンは指定した時間数（ﾐﾘ秒）だけ生きている。
 * 
 * 【課題】
 * クローンを削除するメソッドを用意したい。
 * クローン削除されるとき、そのクローンで動いているスレッドも消すこと
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample17】十字にマウスポインターが触れたら 蝶のクローンを作る"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cross1.svg','Cross01');
    this.Image.load('../assets/cross2.svg','Cross02');
    this.Image.load('../assets/butterfly1.svg','Butterfly01');
    this.Image.load('../assets/butterfly2.svg','Butterfly02');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );

    St.cross = new Libs.Sprite("Cross");
    St.cross.Image.add( Images.Cross01 );
    St.cross.Image.add( Images.Cross02 );
    St.cross.Looks.setSize({x:300,y:300});

    St.butterfly = new Libs.Sprite("Butterfly");
    St.butterfly.Image.add( Images.Butterfly01 );
    St.butterfly.Image.add( Images.Butterfly02 );
    St.butterfly.Looks.hide();
}

Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Sounds.Chill, { 'volume' : 20 } );
    });

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.C.forever( async _=>{
            await this.Sound.playUntilDone();
        });
    });

    const ChangeDirection = 1;
    St.cross.Event.whenFlag(async function(){
        this.C.while(true, async _=>{
            this.Motion.turnRightDegrees(ChangeDirection);
        });
    });
    St.cross.Event.whenFlag(async function(){
        this.C.while(true, async _=>{
            if ( this.Sensing.isMouseTouching() ) {
                this.Looks.nextCostume();
                await Libs.waitWhile( ()=>this.Sensing.isMouseTouching());
                this.Looks.nextCostume();
            }
        });
    });
    St.cross.Event.whenFlag(async function(){
        this.C.forever( async _=>{
            if ( this.Sensing.isMouseTouching() ) {
                const butterfly = St.butterfly;
                const mousePosition = Libs.mousePosition;
                butterfly.Motion.gotoXY(mousePosition);
                const scale = {x: 15, y: 15}
                butterfly.Looks.setSize(scale);
                butterfly.Motion.pointInDirection(Libs.randomDirection);
                await St.butterfly.Control.clone();
                // 下をコメントアウトすると、十字にさわっている間は クローンを作り続ける
                // 下を生かすと、十字に触ったときにクローンを作るが、次には進まない
                //await Libs.waitUntil( this.isNotMouseTouching, this); // 「マウスポインターが触らない」迄待つ。
                await Libs.wait(100); // 100ミリ秒待つ。 <== クローン発生する間隔
            }
        });
    });
    St.butterfly.Control.whenCloned( function() {
        const clone = this;
        clone.C.forever( async _=>{
            if(clone.life > 0 ){
                this.Looks.nextCostume();
                await Libs.wait(50);    
            }else{
                Libs.Loop.break();
            }
        });
    });
    St.butterfly.Control.whenCloned( function() {
        const clone = this;
        clone.show();
        clone.life = 5000; // ミリ秒。クローンが生きている時間。（およその時間）
        clone.C.forever( async _=>{
            // ランダムな場所
            const randomPoint = Libs.randomPoint;
            // １秒でどこかに行く。
            await this.Motion.glideToPosition(5, randomPoint.x, randomPoint.y);
            // ライフがゼロになったら「繰り返し」を抜ける
            if( this.life < 0) {
                Libs.Loop.break();
            }        
        });
    
    });
}