/**
 * Sample17
 * スプライト（CROSS) : 右側に回転 、マウスポインターに触れたら 蝶のクローンを作る（クローンの位置はマウスポインターの位置）
 * スプライト（butterfly) : 非表示、クローンされたら表示に切り替える、クローンは指定した時間数（ﾐﾘ秒）だけ生きている。
 * 
 * 【課題】
 * クローンを削除するメソッドを用意したい。
 * クローン削除されるとき、そのクローンで動いているスレッドも消すこと
 */
const [Libs,P,Pool] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cross1.svg','Cross01');
    this.loadImage('../assets/cross2.svg','Cross02');
    this.loadImage('../assets/butterfly1.svg','Butterfly01');
    this.loadImage('../assets/butterfly2.svg','Butterfly02');
}
P.prepare = async function prepare() {
    Pool.stage = new Libs.Stage("stage");
    Pool.stage.addImage( P.images.Jurassic );

    Pool.cross = new Libs.Sprite("Cross");
    Pool.cross.addImage( P.images.Cross01 );
    Pool.cross.addImage( P.images.Cross02 );
    Pool.cross.setScale(300,300);

    Pool.butterfly = new Libs.Sprite("Butterfly");
    Pool.butterfly.addImage( P.images.Butterfly01 );
    Pool.butterfly.addImage( P.images.Butterfly02 );
    Pool.butterfly.setVisible(false);
}

P.setting = async function setting() {

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    const ChangeDirection = 1;
    Pool.cross.whenFlag(async function(){
        this.while(true, async _=>{
            this.turnRight(ChangeDirection);
        });
    });
    Pool.cross.whenFlag(async function(){
        this.while(true, async _=>{
            if ( this.isMouseTouching() ) {
                this.nextCostume();
                await Libs.waitUntil( this.isNotMouseTouching, this);
                this.nextCostume();
            }
        });
    });
    Pool.cross.whenFlag(async function(){
        this.while(true, async _=>{
            if ( this.isNotMouseTouching() ) {
                const butterfly = Pool.butterfly;
                const mousePosition = Libs.mousePosition;
                butterfly.position.x = mousePosition.x;
                butterfly.position.y = mousePosition.y;
                const scale = {x: 15, y: 15}
                butterfly.scale.x = scale.x;
                butterfly.scale.y = scale.y;
                butterfly.direction = Libs.randomDirection;
                await Pool.butterfly.clone();
                // 下をコメントアウトすると、十字にさわっている間は クローンを作り続ける
                // 下を生かすと、十字に触ったときにクローンを作るが、次には進まない
                await Libs.waitUntil( this.isNotMouseTouching, this); // 「マウスポインターが触らない」迄待つ。
                //await P.Utils.wait(100); // 100ミリ秒待つ。 <== クローン発生する間隔
            }
        });
    });
    Pool.butterfly.whenCloned( function() {
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
    Pool.butterfly.whenCloned( function() {
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