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
P.setting = async function setting() {

    P.stage.whenFlag(function(){
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });
    P.cat.whenFlag(function(){
        this.addSound( P.sounds.Mya, { 'volume' : 100 } );
    });
    const direction = 1;
    P.cat.whenFlag( async function() {
        this.while(true, _=>{
            console.log(this.id);
            this.direction += direction;
        });
    });
    P.cat.whenClicked(async function () {
        P.cat.clone();
    });

    const catStep = 5;
    P.cat.whenCloned( async function() {
        console.log("Cloned")
        console.log(this);  
        this.visible = true;
        this.while(true, _=>{
            this.moveSteps(catStep);
            this.ifOnEdgeBounds();

        });
    });
}