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
        await stage.addSound( P.sounds.Chill, { 'volume' : 100 } );
        await stage.while(true, async _=>{
            // ＢＧＭを鳴らし続ける（終わるまで待つ）
            await stage.startSoundUntilDone();
        })
    });

    const catStep = 10;

    P.cat.whenFlag( async cat=>{
        cat.addSound( P.sounds.Mya, { 'volume' : 5 } );
    });

    P.cat.whenFlag( async cat=>{
        // ずっと「左右」に動く。端に触れたら跳ね返る。
        cat.while( true, _=> {
            cat.moveSteps(catStep);
            cat.ifOnEdgeBounds();
        });
    });

    P.cat.whenFlag( async cat=>{
        // 端に触れたらニャーと鳴く。
        await cat.while( true, _=> {
            if(cat.isTouchingEdge()){
                cat.soundPlay()
            }
        });
    });

}