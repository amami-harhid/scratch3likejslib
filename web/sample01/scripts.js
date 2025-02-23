/**
 * 背景を表示する
 */
// ライブラリーをインポートして実行
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample01】背景を表示する";

const Jurassic = "Jurassic";

let stage;

Pg.preload = function() {
    // this を Processインスタンスと認識させるために、function(){} の形式にする。
    this.Image.load('../assets/Jurassic.svg', Jurassic);
}
Pg.prepare = function() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );

}
Pg.setting = function() {
    // Do nothing.
};
