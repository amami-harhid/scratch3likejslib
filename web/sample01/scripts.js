/**
 * 背景を表示する
 */
// ライブラリーをインポートして実行
import {PlayGround, Library} from '../../build/index.js'
// 短縮名にする
const [Pg, Lib] = [PlayGround, Library]; 

Pg.title = "【Sample01】背景を表示する";

const Jurassic = "Jurassic";

let stage;

Pg.preload = function() {
    // this を Processインスタンスと認識させるために、function(){} の形式にする。
    this.Image.load('../assets/Jurassic.svg', Jurassic);
}

Pg.prepare = function() {
    stage = new Lib.Stage();
}

Pg.setting = function() {
    // すぐに実行する。
    stage.Event.whenRightNow( async function(){
        this.Image.add( Jurassic );
    });
};
