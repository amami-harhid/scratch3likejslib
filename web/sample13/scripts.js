/**
 * Sample13
 * スプライト（CAT) クリックした位置へ１秒で動く
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
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });

    P.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    P.stage.whenClicked(async function(){
        // function() の中なので、【this】はProxy(stage)である。
        const mousePosition = P.mousePosition;
        await P.cat.glideToPosition( 1, mousePosition.x, mousePosition.y );
    });
}