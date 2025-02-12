/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭは『終わるまで音を鳴らす』をずっと繰り返す。
 */
P.preload = async p => {
    p.loadImage('../assets/Jurassic.svg','Jurassic');
    p.loadSound('../assets/Chill.wav','Chill');
}
P.prepare = async _=> {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
}
P.setting = async _=> {
    // すぐに実行する。
    P.stage.whenRightNow( $this =>{
        // ここでの『$this』は Proxy(stage)である。
        $this.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });
    P.stage.whenFlag( $this=>{ 
        // 「終わるまで音を鳴らす」をずっと繰り返す
        $this.while(true, async _=>{
            // 処理が終わるまで待つために await をつける
            await $this.startSoundUntilDone();
        });
    });
}
