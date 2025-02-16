/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
import '../../build/likeScratchLib.js'
(async function(L, M, S){
    console.log(S)
    M.preload = function() {
        // ここでの『this』は M(Mainインスタンス) である。
        this.loadImage('../assets/Jurassic.svg','Jurassic');
    }
    M.prepare = function() {
        S.stage = new L.Stage();
    }
    M.setting = async function() {
        // すぐに実行する。
        S.stage.whenRightNow( function(){
            // ここでの『this』は Proxy(Stage)である。
            this.addImage( M.images.Jurassic );
        });
    };

})(likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool);