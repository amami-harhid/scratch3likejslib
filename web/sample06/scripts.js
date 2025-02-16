/**
 * Sample06
 * フラグクリックでスプライトを表示する
 * スプライトにタッチするとBGMを繰返し鳴らす。
 */
const [L,P,S] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    S.stage = new L.Stage();
    S.stage.addImage( P.images.Jurassic );
    // スプライトを作り、コスチュームを１個登録する
    S.cat = new L.Sprite("Cat");
    S.cat.addImage( P.images.Cat );
    S.cat.addSound( P.sounds.Chill, { 'volume' : 100 } );
    S.cat.visible = false; // 非表示
}
P.setting = async function setting() {

    // フラグをクリックしたときの動作
    S.stage.whenFlag( _=> {
        // アロー関数なので、ここでの『this』はPである
        S.cat.visible = true; // 表示
    });

    // スプライト（ネコ）をクリックしたときの動作
    S.cat.whenClicked( async (ネコ) => {
        // アロー関数なので、ここでの『this』はPである
        // catのインスタンスは 『ネコ』として受け取っている。
        // 「終わるまで音を鳴らす」をずっと繰り返す
        ネコ.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await ネコ.startSoundUntilDone();
        });
    });
}
