/**
 * Sample04
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
}
P.setting = async function setting() {
    // すぐに実行する。
    P.stage.whenRightNow( async function(){
        // ここでの『this』は P.stage である。
        await this.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });

    // ステージをクリックしたときの動作
    P.stage.whenClicked( async function() {
        // 「終わるまで音を鳴らす」をずっと繰り返す
        await this.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await this.startSoundUntilDone();
        });
    });
}