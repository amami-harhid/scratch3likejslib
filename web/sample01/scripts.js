/**
 * 背景を表示する
 */

const main = function(Pg, Libs, St,  Images, Sounds){

    Pg.title = "【Sample01】背景を表示する";

    Pg.preload = function() {
        // this を Processインスタンスと認識させるために、function(){} の形式にする。
        this.loadImage('../assets/Jurassic.svg','Jurassic');
    }
    Pg.prepare = function() {
        St.stage = new Libs.Stage();
        St.stage.addImage( Images.Jurassic );

    }
    Pg.setting = function() {
        // Do nothing.
    };

}

// ライブラリーをインポートして実行
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'
main(PlayGround, Libs, Storage, Images, Sounds);
