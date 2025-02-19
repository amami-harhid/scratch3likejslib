/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
import '../../build/likeScratchLib.js'
(async function(Pg, St, Libs, Images, Sounds){

    Pg.title = "【Sample02】旗クリックで背景を表示する";

    Pg.preload = function() {
        // ここでの『this』は M(Mainインスタンス) である。
        this.loadImage('../assets/Jurassic.svg','Jurassic');
    }
    Pg.prepare = function() {
        St.stage = new Libs.Stage();
    }
    Pg.setting = async function() {
        // すぐに実行する。
        St.stage.whenRightNow( function(){
            // ここでの『this』は Proxy(Stage)である。
            console.log('whenRightNow')
            this.addImage( Images.Jurassic );
        });
    };


})(likeScratchLib.PlayGround, 
    likeScratchLib.Storage, 
    likeScratchLib.Libs, 
    likeScratchLib.Images, 
    likeScratchLib.Sounds);