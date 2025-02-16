/**
 * Sample09
 * スプライトのクローンを作る（スプライトをクリックしたらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
const [Libs,Process,Pool] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
Process.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
Process.prepare = async function prepare() {
    Pool.stage = new Libs.Stage();
    Pool.stage.addImage( Process.images.Jurassic );
    Pool.cat = new Libs.Sprite("Cat");
    Pool.cat.addImage( Process.images.Cat );
}

const direction01 = 1;
Process.setting = async function setting() {

    Pool.stage.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(stage)である
        this.addSound( Process.sounds.Chill, { 'volume' : 100 } );
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });
    Pool.cat.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(cat)である
        this.addSound( Process.sounds.Mya, { 'volume' : 100 } );
    });

    // { }の外側のスコープを参照できる
    const direction02 = 1;
    Pool.cat.whenFlag( async function() {
        this.while(true, _=>{
            this.direction += direction01+direction02;
        });
    });
    Pool.cat.whenClicked(async function () {
        this.soundPlay();
        this.clone();
    });

    const catStep = 10;
    Pool.cat.whenCloned( async function() {
        this.visible = true;
        this.while(true, _=>{
            this.moveSteps(catStep);
            this.ifOnEdgeBounds();
        });
    });
}