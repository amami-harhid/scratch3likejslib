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
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
    P.cat.addSound( P.sounds.Chill, { 'volume' : 100 } );
}
P.setting = async function setting() {

    // スプライト（ネコ）をクリックしたときの動作
    P.cat.whenClicked(async function () {
        // 「終わるまで音を鳴らす」をずっと繰り返す
        this.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await this.startSoundUntilDone();
        });
    });
}