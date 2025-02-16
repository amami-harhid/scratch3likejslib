/**
 * Sample12
 * スプライト（CAT)を クリックした場所へ移動する
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

    // ここはfunction式の中なので 【this】= P である
    // ここをアロー式にすると 【this】= window となる

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
    Pool.stage.whenClicked(async _=> {
        // アロー関数の中なので、【this】は 上の階層 の this = P である。
        const x = Libs.mousePosition.x;
        const y = Libs.mousePosition.y;
        Pool.cat.moveTo(x,y)
    });
}