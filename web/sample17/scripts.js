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
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cross1.svg','Cross01');
    this.loadImage('../assets/cross2.svg','Cross02');
    this.loadImage('../assets/butterfly1.svg','Butterfly01');
    this.loadImage('../assets/butterfly2.svg','Butterfly02');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );

    St.cross = new Libs.Sprite("Cross");
    St.cross.addImage( Images.Cross01 );
    St.cross.addImage( Images.Cross02 );
    St.cross.setScale(300,300);

    St.butterfly = new Libs.Sprite("Butterfly");
    St.butterfly.addImage( Images.Butterfly01 );
    St.butterfly.addImage( Images.Butterfly02 );
    St.butterfly.setVisible(false);
}

Pg.setting = async function setting() {

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( Sounds.Chill, { 'volume' : 20 } );
    });

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    const ChangeDirection = 1;
    St.cross.whenFlag(async function(){
        this.while(true, async _=>{
            this.turnRight(ChangeDirection);
        });
    });
    St.cross.whenFlag(async function(){
        this.while(true, async _=>{
            if ( this.isMouseTouching() ) {
                this.nextCostume();
                await Libs.waitWhile( ()=>this.isMouseTouching());
                this.nextCostume();
            }
        });
    });
    St.cross.whenFlag(async function(){
        this.while(true, async _=>{
            if ( this.isMouseTouching() ) {
                const butterfly = St.butterfly;
                const mousePosition = Libs.mousePosition;
                butterfly.position.x = mousePosition.x;
                butterfly.position.y = mousePosition.y;
                const scale = {x: 15, y: 15}
                butterfly.scale.x = scale.x;
                butterfly.scale.y = scale.y;
                butterfly.direction = Libs.randomDirection;
                await St.butterfly.clone();
                // 下をコメントアウトすると、十字にさわっている間は クローンを作り続ける
                // 下を生かすと、十字に触ったときにクローンを作るが、次には進まない
                //await Libs.waitUntil( this.isNotMouseTouching, this); // 「マウスポインターが触らない」迄待つ。
                await Libs.wait(100); // 100ミリ秒待つ。 <== クローン発生する間隔
            }
        });
    });
    St.butterfly.whenCloned( function() {
        const clone = this;
        clone.while(true, async _=>{
            if(clone.life > 0 ){
                this.nextCostume();
                await Libs.wait(50);    
            }else{
                Libs.Loop.break();
            }
        });
    });
    St.butterfly.whenCloned( function() {
        const clone = this;
        clone.setVisible(true);
        clone.life = 5000; // ミリ秒。クローンが生きている時間。（およその時間）
        clone.setVisible(true);
        clone.while(true, async _=>{
            // ランダムな場所
            const randomPoint = Libs.randomPoint;
            // １秒でどこかに行く。
            await this.glideToPosition(5, randomPoint.x, randomPoint.y);
            // ライフがゼロになったら「繰り返し」を抜ける
            if( this.life < 0) {
                Libs.Loop.break();
            }        
        });
    
    });
}