/**
 * 背景を表示＆ＢＧＭを鳴らす
 * ＢＧＭは『終わるまで音を鳴らす』をずっと繰り返す。
 */
P.preload = function() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
}
P.prepare = function() {
    this.stage = new P.Stage();
    this.stage.addImage( P.images.Jurassic );
}
P.setting = function() {
    // すぐに実行する。
    this.stage.whenRightNow( function(){
        // ここでの『this』は Proxy(stage)である。
        this.addSound( P.sounds.Chill, { 'volume' : 100 } );
    });
    this.stage.whenFlag( function(){ 
        // 「終わるまで音を鳴らす」をずっと繰り返す
        this.while(true, async _=>{
            //console.log(this);
            // 処理が終わるまで待つために await をつける
            await this.startSoundUntilDone();
        });
    });
}
