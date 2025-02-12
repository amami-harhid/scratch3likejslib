/**
 * Sample09
 * スプライトのクローンを作る（スプライトをクリックしたらクローンを作る）
 * クローンされたら動きだす（端に触れたらミャーとないて折り返す）
 */
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
}

const direction01 = 1;
P.setting = async function setting() {

    P.stage.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(stage)である
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });
    P.cat.whenFlag(function(){
        // function(){} と書くとき、『this』は Proxy(cat)である
        this.addSound( P.sounds.Mya, { 'volume' : 100 } );
    });

    // { }の外側のスコープを参照できる
    const direction02 = 1;
    P.cat.whenFlag( async function() {
        this.while(true, _=>{
            this.direction += direction01+direction02;
        });
    });
    P.cat.whenClicked(async function () {
        P.cat.clone();
    });

    const catStep = 2;
    P.cat.whenCloned( async function() {
        this.visible = true;
        this.while(true, _=>{
            this.moveSteps(catStep);
            this.ifOnEdgeBounds();

        });
    });
}