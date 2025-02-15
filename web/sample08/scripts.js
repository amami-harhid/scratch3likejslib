/**
 * Sample08
 * スプライトを 動かす( 端に触れたら ミャーと鳴く)
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

    P.stage.whenFlag(async stage=>{
        // ここでの『this』は P であるので、this.sounds は P.soundsと同じである。 
        // stageのインスタンスは 『stage』の変数で受け取っている。
        await stage.addSound( this.sounds.Chill, { 'volume' : 100 } );
        await stage.while(true, async _=>{
            // ＢＧＭを鳴らし続ける（終わるまで待つ）
            await stage.startSoundUntilDone();
        })
    });

    const catStep = 10;

    P.cat.whenFlag( async _cat=>{
        _cat.addSound( P.sounds.Mya, { 'volume' : 5 } );
    });

    P.cat.whenFlag( async _cat=>{
        // ずっと「左右」に動く。端に触れたら跳ね返る。
        _cat.while( true, _=> {
            _cat.moveSteps(catStep);
            _cat.ifOnEdgeBounds();
        });
    });

    P.cat.whenFlag( async _cat=>{
        // 端に触れたらニャーと鳴く。
        await _cat.while( true, _=> {
            if(_cat.isTouchingEdge()){
                _cat.soundPlay()
            }
        });
    });

}