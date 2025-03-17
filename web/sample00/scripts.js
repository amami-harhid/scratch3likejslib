/**
 * 何もしない場合のサンプル
 */

// ライブラリーをインポートして実行
import {PlayGround, Library} from '../../build/likeScratchLib.js'
// 短縮名にする
const [Pg, Lib] = [PlayGround, Library]; // eslint-disable-line no-unused-vars

Pg.title = "【Sample00】何もしない場合のサンプル";

Pg.preload = function() {
    // Do nothing.
}
Pg.prepare = function() {
    // Do nothing.
}
Pg.setting = function() {
    // Do nothing.
};
