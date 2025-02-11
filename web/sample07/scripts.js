/**
 * Sample07
 * スプライトを左右に動かす。端に触れたら跳ね返る
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    P.stage.addSound( P.sounds.Chill, { 'volume' : 100 } );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
}
P.setting = async function setting() {

    // フラグクリック
    P.stage.whenFlag( async function() {
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        console.log("stage")
        await this.while( true, async _=> {
            await this.startSoundUntilDone();
        });
    });

    const catStep = 5;
    // フラグクリック
    P.cat.whenFlag( async function() {
        console.log("cat")
        // 「左右」に動く。端に触れたら跳ね返る。
        await this.while( true, async _=> {
            this.moveSteps(catStep);
            this.ifOnEdgeBounds();
        });
    });


}