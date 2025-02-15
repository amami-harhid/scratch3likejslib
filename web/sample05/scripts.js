/**
 * Sample05
 * スプライトを作る
 */

P.preload = function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    P.stage.addSound( P.sounds.Chill, { 'volume' : 100 } );
}
P.setting = function setting() {
    
    // フラグをクリックしたときの動作
    // whenFlagのなかでStageの『this』を使わずに、
    // Pのthisとして使うのであれば、アロー式（引数省略）で書いて
    // this.cat として明示的に使うことでもよい。
    // ここでは、this.cat は P.catと同じ意味である。
    this.stage.whenFlag( _=> {
        // 旗クリックしたタイミングでネコのスプライトを作り、
        // コスチュームを１個登録する
        this.cat = new P.Sprite("Cat");
    });
    this.stage.whenFlag( _=> {
        // コスチュームを１個登録する
        // whenFlagを定義した順番に実行されるので、
        // ここの『旗クリック』の処理ではネコのスプライトは作成済である。
        this.cat.addImage( P.images.Cat );
    });
}
