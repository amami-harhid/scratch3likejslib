/**
 * 背景を表示する
 */
P.preload = function() {
    // this を Processインスタンスと認識させるために、function(){} の形式にする。
    this.loadImage('../assets/Jurassic.svg','Jurassic');
};
P.prepare = function() {
    this.stage = new P.Stage();
    this.stage.addImage( P.images.Jurassic );
};
P.setting = function() {
    // Do nothing.
};
