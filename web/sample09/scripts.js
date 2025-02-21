/**
 * Sample09
 * スプライトのクローンを作る（スプライトをクリックしたらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample09】スプライトをクリックしたらクローンを作る。端に触れたらミャーとないて折り返す。"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
    this.Sound.load('../assets/Cat.wav','Mya');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage();
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.Image.add( Images.Cat );
}

const direction01 = 1;
Pg.setting = async function setting() {

    St.stage.Event.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(stage)である
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
        this.Control.while(true, async _=>{
            await this.Sound.playUntilDone();
        })
    });
    St.cat.Event.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(cat)である
        this.Sound.add( Sounds.Mya, { 'volume' : 20 } );
    });
    St.cat.Event.whenFlag( async cat=> {
        // 初期化
        cat.Motion.gotoXY({x:0, y:0});
        cat.Motion.pointInDerection( 90 );
    });

    // { }の外側のスコープを参照できる
    const direction02 = 1;
    St.cat.Event.whenFlag( async function() {
        this.Control.while(true, _=>{
            this.Motion.turnRightDegrees(direction01+direction02);
        });
    });
    St.cat.Event.whenClicked(async function () {
        //this.soundPlay();
        this.Control.clone();
    });

    const catStep = 10;
    St.cat.Control.whenCloned( async function() {
        this.Looks.show();
        this.Control.while(true, _=>{
            this.Motion.moveSteps(catStep);
            this.Motion.ifOnEdgeBounds();
            if(this.Sensing.isTouchingEdge() ){
                // ミャーと鳴く。
                this.Sound.play()
            }        
        });
    });
}