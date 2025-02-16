/**
 * Sample04
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 */

// アロー関数として引数に Pインスタンスを受け取ることもできる。
(function(L, M, S){

    M.preload = function($p) {
        $p.loadImage('../assets/Jurassic.svg','Jurassic');
        $p.loadSound('../assets/Chill.wav','Chill');
    }
    M.prepare = function($p) {
        S.stage = new L.Stage();
        S.stage.addImage( M.images.Jurassic );
    }
    M.setting = function($p) {
        // すぐに実行する。
        // アロー関数として インスタンス(this)を受け取る書き方もできる
        S.stage.whenRightNow( async $s=>{ 
            // ここでの『$s』は S.stageの『this』 である。
            await $s.addSound( M.sounds.Chill, { 'volume' : 100 } );
        });

        // ステージをクリックしたときの動作
        S.stage.whenClicked( async $s=> {
            // 「終わるまで音を鳴らす」をずっと繰り返す
            await $s.while(true, async _=>{
                // 処理が終わるまで待つために await をつける
                await $s.startSoundUntilDone();
            });
        });
    };

})(likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool);