/**
 * Sample09
 * スプライトのクローンを作る（スプライトをクリックしたらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample09】スプライトをクリックしたらクローンを作る。端に触れたらミャーとないて折り返す。"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage();
    St.stage.addImage( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.addImage( Images.Cat );
}

const direction01 = 1;
Pg.setting = async function setting() {

    St.stage.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(stage)である
        this.addSound( Sounds.Chill, { 'volume' : 50 } );
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });
    St.cat.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(cat)である
        this.addSound( Sounds.Mya, { 'volume' : 20 } );
    });

    // { }の外側のスコープを参照できる
    const direction02 = 1;
    St.cat.whenFlag( async function() {
        this.while(true, _=>{
            this.direction += direction01+direction02;
        });
    });
    St.cat.whenClicked(async function () {
        //this.soundPlay();
        this.clone();
    });

    const catStep = 10;
    St.cat.whenCloned( async function() {
        this.visible = true;
        this.while(true, _=>{
            this.moveSteps(catStep);
            this.ifOnEdgeBounds();
            if(this.isTouchingEdge() ){
                // ミャーと鳴く。
                this.soundPlay()
            }        
        });
    });
}