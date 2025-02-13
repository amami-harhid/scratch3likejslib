/**
 * Sample15
 * スプライト（CAT) は端を越えて進めない。
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

    const CAT_WALK_STEP = 5;
    P.cat.whenFlag(async function(){
        this.while(true, async _=>{
            const mousePosition = P.mousePosition;
            // マウスカーソルの場所へ1秒かけて移動する
            this.moveSteps(CAT_WALK_STEP);
        });
    });
}