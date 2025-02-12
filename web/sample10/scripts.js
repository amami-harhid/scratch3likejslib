/**
 * Sample10
 * スプライトのクローンを作る（スプライトに触ったらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.position.x = 200;
    P.cat.position.y = 150;
    P.cat.addImage( P.images.Cat );
}
P.setting = async function setting() {

    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });
    P.stage.whenFlag(async function() {
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });

    P.cat.whenFlag( async function() {
        // 音を登録する
        this.addSound( P.sounds.Mya, { 'volume' : 1 } );
    });

    const _changeDirection = 1;
    P.cat.whenFlag( async function() {
        // ずっと繰り返して回転する
        this.while(true, _=>{
            this.direction += _changeDirection; // 外の Scope 参照可能
        });
    });
    P.cat.whenFlag( async function() {
        // 次をずっと繰り返す
        // マウスカーソルでタッチしたら、クローンを作る
        this.while(true, async _=>{
            if( this.isMouseTouching() ) {
                this.clone();
            }
            // マウスタッチしないまで待つ
            await P.Utils.waitUntil( this.isNotMouseTouching, P.Env.pace,  this ); 
        });
    });

    const steps = 10;
    P.cat.whenCloned(async function(){
        const clone = this; // 'this' is cloned instance;
        clone.position.x = 100;
        clone.position.y = -100;
        clone.scale.x = 50;
        clone.scale.y = 50;
        clone.effect.color = 50;
        clone.life = 1000;
        clone.setVisible(true)
        // ずっと繰り返す
        clone.while(true, _=>{
            clone.moveSteps( steps );
            clone.ifOnEdgeBounds();
            // 端に触れたら
            if(clone.isTouchingEdge() ){
                // ミャーと鳴く。
                clone.soundPlay()
            }
        });
    });
}