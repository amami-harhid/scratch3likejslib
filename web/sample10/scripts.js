/**
 * Sample10
 * スプライトのクローンを作る（スプライトに触ったらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
const [Libs,P,Pool] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
P.prepare = async function prepare() {
    Pool.stage = new Libs.Stage("stage");
    Pool.stage.addImage( P.images.Jurassic );
    Pool.cat = new Libs.Sprite("Cat");
    Pool.cat.position.x = 200;
    Pool.cat.position.y = 150;
    Pool.cat.addImage( P.images.Cat );
}
P.setting = async function setting() {

    Pool.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    Pool.stage.whenFlag(async function() {
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });

    Pool.cat.whenFlag( async function() {
        // 音を登録する
        this.addSound( P.sounds.Mya, { 'volume' : 50 } );
    });

    const _changeDirection = 1;
    Pool.cat.whenFlag( async function() {
        // ずっと繰り返して回転する
        this.while(true, _=>{
            this.direction += _changeDirection; // 外の Scope 参照可能
        });
    });
    Pool.cat.whenFlag( async function() {
        // 次をずっと繰り返す
        // マウスカーソルでタッチしたら、クローンを作る
        this.while(true, async _=>{
            if( this.isMouseTouching() ) {
                this.clone();
            }
            // マウスタッチしないまで待つ
            await Libs.Utils.waitUntil( this.isNotMouseTouching, Libs.Env.pace,  this ); 
        });
    });

    const steps = 10;
    Pool.cat.whenCloned(async function(){
        const clone = this; // 'this' is cloned instance;
        clone.position.x = 100;
        clone.position.y = -100;
        clone.scale.x = 50;
        clone.scale.y = 50;
        clone.effect.color = 50;
        clone.life = 5000;
        clone.setVisible(true)
        // ずっと繰り返す
        clone.while(true, _=>{
            clone.moveSteps( steps );
            // 端に触れたら
            clone.ifOnEdgeBounds();
            if(clone.isTouchingEdge() ){
                // ミャーと鳴く。
                clone.soundPlay()
            }
        });
    });
}