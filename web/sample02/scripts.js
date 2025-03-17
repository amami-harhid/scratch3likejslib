/**
 * 背景を表示する(settingで表示)
 * preset()内で addImageする場合と比較してステージに表示するのが一瞬だけ遅延する。
 */
// ライブラリーをインポートして実行
import {PlayGround, Library} from '../../build/likeScratchLib.js';
// 短縮名にする
const [Pg, Lib] = [PlayGround, Library]; 

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
    stage.Event.whenRightNow( async function(){
        this.Image.add( Jurassic );
    });
};
