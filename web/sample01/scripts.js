/**
 * 背景を表示する
 */
// ライブラリーをインポートして実行
import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample01】背景を表示する";

Pg.preload = function() {
    // this を Processインスタンスと認識させるために、function(){} の形式にする。
    this.Image.load('../assets/Jurassic.svg','Jurassic');
}
Pg.prepare = function() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );

}
Pg.setting = function() {
    // Do nothing.
};
