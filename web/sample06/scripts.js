/**
 * Sample06
 * フラグクリックでスプライトを表示する
 * スプライトにタッチするとBGMを繰返し鳴らす。
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    // スプライトを作り、コスチュームを１個登録する
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
    P.cat.addSound( P.sounds.Chill, { 'volume' : 100 } );
    P.cat.visible = false; // 非表示
}
P.setting = async function setting() {

    // フラグをクリックしたときの動作
    P.stage.whenFlag( async function() {
        P.cat.visible = true; // 表示
    });

    // スプライト（ネコ）をクリックしたときの動作
    P.cat.whenClicked( function() {
        // 「終わるまで音を鳴らす」をずっと繰り返す
        this.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await this.startSoundUntilDone();
        });
    });
}
