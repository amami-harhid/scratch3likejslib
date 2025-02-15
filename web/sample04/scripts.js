/**
 * Sample04
 * ステージをクリック（タッチ）したときに音を鳴らす（ずっと繰り返し）
 */

// アロー関数として引数に Pインスタンスを受け取ることもできる。
P.preload = $p => { 
    $p.loadImage('../assets/Jurassic.svg','Jurassic');
    $p.loadSound('../assets/Chill.wav','Chill');
}
P.prepare = $p => {
    $p.stage = new P.Stage();
    $p.stage.addImage( P.images.Jurassic );
}
P.setting =  $p => {

    // すぐに実行する。
    // アロー関数として インスタンス(this)を受け取る書き方もできる
    $p.stage.whenRightNow( async $s=>{ 
        // ここでの『$s』は P.stageの『this』 である。
        await $s.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });

    // ステージをクリックしたときの動作
    $p.stage.whenClicked( async $s=> {
        // 「終わるまで音を鳴らす」をずっと繰り返す
        await $s.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await $s.startSoundUntilDone();
        });
    });
}