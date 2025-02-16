/**
 * 背景を表示する
 */
import '../../build/likeScratchLib.js'
(function(L, M, S){

    M.preload = function() {
        // this を Processインスタンスと認識させるために、function(){} の形式にする。
        this.loadImage('../assets/Jurassic.svg','Jurassic');
    }
    M.prepare = function() {
        S.stage = new M.Stage();
        S.stage.addImage( M.images.Jurassic );
    }
    M.setting = function() {
        // Do nothing.
    };

})(likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool);
