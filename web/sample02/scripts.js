/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
// ライブラリーをインポートして実行
import {PlayGround, Library, Storage} from '../../build/likeScratchLib.js'
const [Pg, Lib, St] = [PlayGround, Library, Storage]; // 短縮名にする

Pg.title = "【Sample02】旗クリックで背景を表示する";

const Jurassic = "Jurassic";

let stage;

Pg.preload = function() {
    // ここでの『this』は M(Mainインスタンス) である。
    this.Image.load('../assets/Jurassic.svg', Jurassic);
}
Pg.prepare = function() {
    stage = new Lib.Stage();
}
Pg.setting = async function() {
    // すぐに実行する。
    stage.Event.whenRightNow( function($stage){
        $stage.Image.add( Jurassic );
    });
};
