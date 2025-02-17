/**
 * Sample08
 * スプライトを 動かす( 端に触れたら ミャーと鳴く)
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
Process.setting = async function setting() {

    Pool.stage.whenFlag(async stage=>{
        // ここでの『this』は P であるので、this.sounds は P.soundsと同じである。 
        // stageのインスタンスは 『stage』の変数で受け取っている。
        await stage.addSound( this.sounds.Chill, { 'volume' : 50 } );
        await stage.while(true, async _=>{
            // ＢＧＭを鳴らし続ける（終わるまで待つ）
            await stage.startSoundUntilDone();
        })
    });

    const catStep = 10;

    Pool.cat.whenFlag( async _cat=>{
        _cat.addSound( Process.sounds.Mya, { 'volume' : 50 } );
    });

    Pool.cat.whenFlag( async _cat=>{
        // ずっと「左右」に動く。端に触れたら跳ね返る。
        _cat.while( true, _=> {
            _cat.moveSteps(catStep);
            _cat.ifOnEdgeBounds();
            if(_cat.isTouchingEdge()){
                _cat.soundPlay()
            }
        });
    });


}