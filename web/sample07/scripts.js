/**
 * Sample07
 * スプライトを左右に動かす。端に触れたら跳ね返る
 */
const [Lib,P,Storage] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    Storage.stage = new Lib.Stage();
    Storage.stage.addImage( P.images.Jurassic );
    Storage.stage.addSound( P.sounds.Chill, { 'volume' : 100 } );
    Storage.cat = new Lib.Sprite("Cat");
    Storage.cat.addImage( P.images.Cat );
}
P.setting = async function setting() {

    // フラグクリック
    Storage.stage.whenFlag( async stage=> {
        // 「終わるまで音を鳴らす」をずっと繰り返す、スレッドを起動する
        await stage.while( true, async _=> {
            await stage.startSoundUntilDone();
        });
    });

    const catStep = 5;
    // フラグクリック
    Storage.cat.whenFlag( async cat=> {
        // 「左右」に動く。端に触れたら跳ね返る。
        await cat.while( true, async _=> {
            cat.moveSteps(catStep);
            cat.ifOnEdgeBounds();
        });
    });


}