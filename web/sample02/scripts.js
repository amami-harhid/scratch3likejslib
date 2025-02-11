/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
P.preload = async function preload() {
    // ここでの『this』は P(Processインスタンス) である。
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage();
}
P.setting = async function setting() {
    // すぐに実行する。
    P.stage.whenRightNow(function(){
        // ここでの『this』は P.stage である。
        this.addImage( P.images.Jurassic );
    });
}
