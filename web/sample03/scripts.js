/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭは『終わるまで音を鳴らす』をずっと繰り返す。
 */
import '../../build/likeScratchLib.js'
(function(L, M, S){

    M.preload = function() {
        this.loadImage('../assets/Jurassic.svg','Jurassic');
        this.loadSound('../assets/Chill.wav','Chill');
    }
    M.prepare = function() {
        S.stage = new L.Stage();
        S.stage.addImage( M.images.Jurassic );
    }
    M.setting = function() {
        // すぐに実行する。
        S.stage.whenRightNow( function(){
            // ここでの『this』は Proxy(stage)である。
            this.addSound( M.sounds.Chill, { 'volume' : 100 } );
        });
        S.stage.whenFlag( function(){ 
            // 「終わるまで音を鳴らす」をずっと繰り返す
            this.while(true, async _=>{
                // 処理が終わるまで待つために await をつける
                await this.startSoundUntilDone();
            });
        });
    };

})(likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool);
