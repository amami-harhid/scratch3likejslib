/**
 * Sample17
 * スプライト（CROSS) : 右側に回転 、マウスポインターに触れたら 蝶のクローンを作る（クローンの位置はマウスポインターの位置）
 * スプライト（butterfly) : 非表示、クローンされたら表示に切り替える、クローンは指定した時間数（ﾐﾘ秒）だけ生きている。
 * 
 * 【課題】
 * クローンを削除するメソッドを用意したい。
 * クローン削除されるとき、そのクローンで動いているスレッドも消すこと
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cross1.svg','Cross01');
    this.loadImage('../assets/cross2.svg','Cross02');
    this.loadImage('../assets/butterfly1.svg','Butterfly01');
    this.loadImage('../assets/butterfly2.svg','Butterfly02');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cross = new P.Sprite("Cross");
    P.cross.addImage( P.images.Cross01 );
    P.cross.addImage( P.images.Cross02 );
    P.cross.setScale(300,300);

    P.butterfly = new P.Sprite("Butterfly");
    P.butterfly.addImage( P.images.Butterfly01 );
    P.butterfly.addImage( P.images.Butterfly02 );
    P.butterfly.setVisible(false);
}

P.setting = async function setting() {

    P.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });

    P.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    const ChangeDirection = 1;
    P.cross.whenFlag(async function(){
        this.while(true, async _=>{
            this.turnRight(ChangeDirection);
        });
    });
    P.cross.whenFlag(async function(){
        this.while(true, async _=>{
            if ( this.isMouseTouching() ) {
                this.nextCostume();
                await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace, this);
                this.nextCostume();
            }
        });
    });
    P.cross.whenFlag(async function(){
        this.while(true, async _=>{
            if ( this.isMouseTouching() ) {
                const butterfly = P.butterfly;
                const mousePosition = P.mousePosition;
                butterfly.position.x = mousePosition.x;
                butterfly.position.y = mousePosition.y;
                const scale = {x: 15, y: 15}
                butterfly.scale.x = scale.x;
                butterfly.scale.y = scale.y;
                butterfly.direction = P.randomDirection;
                await P.butterfly.clone();
                // 下をコメントアウトすると、十字にさわっている間は クローンを作り続ける
                // 下を生かすと、十字に触ったときにクローンを作るが、次には進まない
                await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace, this); // 「マウスポインターが触らない」迄待つ。
                //await P.Utils.wait(100); // 100ミリ秒待つ。 <== クローン発生する間隔
            }
        });
    });
    P.butterfly.whenCloned( function() {
        const clone = this;
        clone.while(true, async _=>{
            if(clone.life > 0 ){
                this.nextCostume();
                await P.wait(50);    
            }else{
                P.Loop.break();
            }
        });
    });
    P.butterfly.whenCloned( function() {
        const clone = this;
        clone.setVisible(true);
        clone.life = 5000; // ミリ秒。クローンが生きている時間。（およその時間）
        clone.setVisible(true);
        clone.while(true, async _=>{
            // ランダムな場所
            const randomPoint = P.randomPoint;
            // １秒でどこかに行く。
            await this.glideToPosition(5, randomPoint.x, randomPoint.y);
            // ライフがゼロになったら「繰り返し」を抜ける
            if( this.life < 0) {
                P.Loop.break();
            }        
        });
    
    });
}