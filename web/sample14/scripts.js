/**
 * Sample14
 * スプライト（CAT) がマウスポインターを追いかける
 * ステージの外に出てもマウスを追いかける（ウィンドウの外は監視できない）
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
    Pool.cat.whenFlag(async function(){
        // 1秒待ってからマウスカーソルを追跡する
        await Libs.wait(1000);
        this.while(true, async _=>{
            // マウスの方向へ向く
            Pool.cat.pointToMouse();
            // 枠内にあった最後の場所
            const mousePosition = Libs.mousePosition;
            // マウスカーソルの場所へ1秒かけて移動する
            await Pool.cat.glideToPosition( 1, mousePosition.x, mousePosition.y );
    
        });
    });
}