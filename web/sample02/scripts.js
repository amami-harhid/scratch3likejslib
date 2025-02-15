/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
P.preload = function() {
    // ここでの『this』は P(Processインスタンス) である。
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}
P.prepare = function() {
    this.stage = new P.Stage();
}
P.setting = function(){
    // すぐに実行する。
    this.stage.whenRightNow( function(){
        // ここでの『this』は Proxy(Stage)である。
        console.log(this);
        this.addImage( P.images.Jurassic );
    });
}
