/**
 * Sample05
 * スプライトを作る
 */
(function(L, M, S){

    M.preload = function() {
        this.loadImage('../assets/Jurassic.svg','Jurassic');
        this.loadSound('../assets/Chill.wav','Chill');
        this.loadImage('../assets/cat.svg','Cat');
    }
    M.prepare = function() {
        S.stage = new L.Stage();
        S.stage.addImage( M.images.Jurassic );
        S.stage.addSound( M.sounds.Chill, { 'volume' : 100 } );
    }
    M.setting = function() {
        // フラグをクリックしたときの動作
        // whenFlagのなかでStageの『this』を使わずに、
        // Pのthisとして使うのであれば、アロー式（引数省略）で書いて
        // this.cat として明示的に使うことでもよい。
        // ここでは、this.cat は P.catと同じ意味である。
        S.stage.whenFlag( _=> {
            // 旗クリックしたタイミングでネコのスプライトを作り、
            // コスチュームを１個登録する
            S.cat = new L.Sprite("Cat");
        });
        S.stage.whenFlag( _=> {
            // コスチュームを１個登録する
            // whenFlagを定義した順番に実行されるので、
            // ここの『旗クリック』の処理ではネコのスプライトは作成済である。
            S.cat.addImage( M.images.Cat );
        });
    };

})(likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool);
