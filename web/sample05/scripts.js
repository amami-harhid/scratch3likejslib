/**
 * Sample05
 * スプライトを作る
 */
import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;

(function(Pg, St, Libs, Images, Sounds){

    Pg.title = "【Sample05】旗クリックでスプライトを表示する"

    Pg.preload = function() {
        this.loadImage('../assets/Jurassic.svg','Jurassic');
        this.loadSound('../assets/Chill.wav','Chill');
        this.loadImage('../assets/cat.svg','Cat');
    }
    Pg.prepare = function() {
        St.stage = new Libs.Stage();
        St.stage.addImage( Images.Jurassic );
        St.stage.addSound( Sounds.Chill, { 'volume' : 100 } );
    }
    Pg.setting = function() {
        // フラグをクリックしたときの動作
        // whenFlagのなかでStageの『this』を使わずに、
        // Pのthisとして使うのであれば、アロー式（引数省略）で書いて
        // this.cat として明示的に使うことでもよい。
        // ここでは、this.cat は P.catと同じ意味である。
        St.stage.whenFlag( _=> {
            // 旗クリックしたタイミングでネコのスプライトを作り、
            // コスチュームを１個登録する
            St.cat = new Libs.Sprite("Cat");
        });
        St.stage.whenFlag( _=> {
            // コスチュームを１個登録する
            // whenFlagを定義した順番に実行されるので、
            // ここの『旗クリック』の処理ではネコのスプライトは作成済である。
            St.cat.addImage( Images.Cat );
        });
    };

})(SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds);
