/**
 * Sample11
 * スプライト（CAT)を １秒で「どこかの」場所へ移動する
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
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });

    Pool.stage.whenFlag(async function() {
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    Pool.cat.whenFlag(async function() {
        this.while(true, async _=>{
            // 繰り返すごとに 1秒待つ
            await Libs.wait(1000);
            // １秒でどこかへ行く
            const randomPoint = Libs.randomPoint;
            await this.glideToPosition(1,  randomPoint.x, randomPoint.y);
        })
    });
}