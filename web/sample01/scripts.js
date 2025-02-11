/**
 * 背景を表示する
 */
P.preload = async function() {
    // this を Processインスタンスと認識させるために、function(){} の形式にする。
    this.loadImage('../assets/Jurassic.svg','Jurassic');
};
P.prepare = async function() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
};
P.setting = async function() {
    // Do nothing.
};
