/**
 * 背景を表示する
 */
import '../../build/likeScratchLib.js'
(function(Pg, St, Libs, Images, Sounds){

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

})(likeScratchLib.PlayGround, 
    likeScratchLib.Storage, 
    likeScratchLib.Libs, 
    likeScratchLib.Images, 
    likeScratchLib.Sounds);