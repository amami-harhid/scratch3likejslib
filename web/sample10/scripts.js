/**
 * Sample10
 * スプライトのクローンを作る（スプライトに触ったらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample10】スプライトに触ったらクローンを作る(5秒で死ぬ)"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
    this.Sound.load('../assets/Cat.wav','Mya');
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Lib.Sprite("Cat");
    St.cat.Image.add( Images.Cat );
    St.cat.Motion.gotoXY({x:200, y:150});
//    St.cat.Motion.gotoXY(200, 150);
    St.cat.Motion.pointInDirection( 90 );
}
Pg.setting = async function setting() {

    St.stage.Event.whenFlag(async function() {
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
    });
    St.stage.Event.whenFlag(async function() {
        this.Control.forever(async _=>{
            await this.Sound.playUntilDone();
        })
    });

    St.cat.Event.whenFlag( async function() {
        // 音を登録する
        this.Sound.add( Sounds.Mya, { 'volume' : 20 } );
    });
    St.cat.Event.whenFlag( async cat=> {
        // 初期化
        St.cat.Motion.gotoXY({x:200, y:150});
        St.cat.Motion.pointInDirection( 90 );
    });

    const _changeDirection = 1;
    St.cat.Event.whenFlag( async function() {
        // ずっと繰り返して回転する
        this.Control.forever( _=>{
            this.Motion.turnRightDegrees(_changeDirection);// 外側Scope 参照可能
        });
    });
    St.cat.Event.whenFlag( async function() {
        // 次をずっと繰り返す
        // マウスカーソルでタッチしたら、クローンを作る
        this.Control.forever(async _=>{
            if( this.Sensing.isMouseTouching() ) {
                this.Control.clone();
            }
            // マウスタッチしないまで待つ
            await Lib.waitWhile( ()=>this.Sensing.isMouseTouching() ); 
        });
    });

    const steps = 10;
    St.cat.Control.whenCloned(async function(){
        const clone = this; // 'this' is cloned instance;
        clone.Motion.gotoXY({x:100, y:-100});
        clone.Looks.setSize({x:50, y:50});
        clone.Looks.setEffect('color', 50);
        clone.life = 5000;
        clone.Looks.show();
        // ずっと繰り返す
        clone.Control.while(true, _=>{
            clone.Motion.moveSteps( steps );
            // 端に触れたら
            clone.Motion.ifOnEdgeBounds();
            if(clone.Sensing.isTouchingEdge() ){
                // ミャーと鳴く。
                clone.Sound.play()
            }
        });
    });
}