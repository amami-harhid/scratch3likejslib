/**
 * Sample12
 * スプライト（CAT)を クリックした場所へ移動する
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.position.x = 0;
    P.cat.position.y = 0;
    P.cat.addImage( P.images.Cat );
}

P.setting = async function setting() {

    P.stage.whenFlag(async function() {
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });

    P.stage.whenFlag(async function() {
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    P.stage.whenClicked(async function() {
        const x = P.mousePosition.x;
        const y = P.mousePosition.y;
        P.cat.moveTo(x,y)
    });
}