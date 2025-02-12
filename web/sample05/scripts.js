/**
 * Sample05
 * スプライトを作る
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
}
P.setting = async function setting() {
    
    // フラグをクリックしたときの動作
    P.stage.whenFlag( _=> {
        // スプライトを作り、コスチュームを１個登録する
        P.cat = new P.Sprite("Cat");
        P.cat.addImage( P.images.Cat );
    });
}
