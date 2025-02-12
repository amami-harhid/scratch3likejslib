/**
 * Sample10
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

    P.stage.whenFlag(function(){
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });
    P.cat.whenFlag(function(){
        this.addSound( P.sounds.Mya, { 'volume' : 50 } );
    });

    const catStep = 5;
    // フラグクリック
    P.cat.whenFlag( function() {
        // 「左右」に動く。端に触れたら跳ね返る。
        this.while( true, async _=> {
            this.moveSteps(catStep);
            this.ifOnEdgeBounds();
        });
    });
    // フラグクリック
    P.cat.whenFlag( function() {
        // 端に触れたらニャーと鳴く。
        this.while( true, async _=> {
            this.isTouchingEdge(_=>{
                this.soundPlay()
            });
        });
    });
}