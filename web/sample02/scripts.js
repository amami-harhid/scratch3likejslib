/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
const main = function(Pg, Libs, St,  Images, Sounds){

    Pg.title = "【Sample02】旗クリックで背景を表示する";

    Pg.preload = function() {
        // ここでの『this』は M(Mainインスタンス) である。
        this.Image.load('../assets/Jurassic.svg','Jurassic');
    }
    Pg.prepare = function() {
        St.stage = new Libs.Stage();
    }
    Pg.setting = async function() {
        // すぐに実行する。
        St.stage.Event.whenRightNow( function(){
            // ここでの『this』は Proxy(Stage)である。
            this.Image.add( Images.Jurassic );
        });
    };
};

// ライブラリーをインポートして実行
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'
main(PlayGround, Libs, Storage, Images, Sounds);