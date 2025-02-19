/**
 * Sample10
 * スプライトのクローンを作る（スプライトに触ったらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample10】スプライトに触ったらクローンを作る。"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.addImage( Images.Cat );
    St.cat.position.x = 200;
    St.cat.position.y = 150;
    St.cat.direction = 90;
}
Pg.setting = async function setting() {

    St.stage.whenFlag(async function() {
        this.addSound( Sounds.Chill, { 'volume' : 50 } );
    });
    St.stage.whenFlag(async function() {
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });

    St.cat.whenFlag( async function() {
        // 音を登録する
        this.addSound( Sounds.Mya, { 'volume' : 20 } );
    });
    St.cat.whenFlag( async cat=> {
        // 初期化
        cat.position.x = 200;
        cat.position.y = 150;
        cat.direction = 90;
    });

    const _changeDirection = 1;
    St.cat.whenFlag( async function() {
        // ずっと繰り返して回転する
        this.while(true, _=>{
            this.direction += _changeDirection; // 外の Scope 参照可能
        });
    });
    St.cat.whenFlag( async function() {
        // 次をずっと繰り返す
        // マウスカーソルでタッチしたら、クローンを作る
        this.while(true, async _=>{
            if( this.isMouseTouching() ) {
                this.clone();
            }
            // マウスタッチしないまで待つ
            await Libs.waitWhile( ()=>this.isMouseTouching() ); 
        });
    });

    const steps = 10;
    St.cat.whenCloned(async function(){
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