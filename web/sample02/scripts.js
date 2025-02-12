/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
P.preload = async p=> {
    // ここでの『this』は P(Processインスタンス) である。
    p.loadImage('../assets/Jurassic.svg','Jurassic');
}
P.prepare = async _=> {
    P.stage = new P.Stage();
}
P.setting = async _=> {
    // すぐに実行する。
    P.stage.whenRightNow( _this=>{
        console.log(_this);
        // ここでの『_this』は Proxy(stage)である。
        _this.addImage( P.images.Jurassic );
    });
}
