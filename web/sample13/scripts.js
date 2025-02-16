/**
 * Sample13
 * スプライト（CAT) クリックした位置へ１秒で動く
 */
const [Libs,P,Pool] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    Pool.stage = new Libs.Stage("stage");
    Pool.stage.addImage( P.images.Jurassic );
    Pool.cat = new Libs.Sprite("Cat");
    Pool.cat.position.x = 0;
    Pool.cat.position.y = 0;
    Pool.cat.addImage( P.images.Cat );
}

P.setting = async function setting() {

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    Pool.stage.whenClicked(async function(){
        // function() の中なので、【this】はProxy(stage)である。
        const mousePosition = Libs.mousePosition;
        await Pool.cat.glideToPosition( 1, mousePosition.x, mousePosition.y );
    });
}