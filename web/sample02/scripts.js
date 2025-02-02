/**
 * Sample02
 * 画像をロードして フラグクリック時に ステージに表示する
 */
P.preload = async function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}

P.prepare = async function() {
    P.stage = new P.Stage();
}

P.setting = async function() {
    // いますぐに実行
    P.stage.whenRightNow(function() {
        this.addImage( P.images.Jurassic );
    });
}

P.init();