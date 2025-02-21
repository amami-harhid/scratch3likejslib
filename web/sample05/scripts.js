/**
 * Sample05
 * スプライトを作る
 */

const main = function(Pg, Libs, St,  Images, Sounds){

    Pg.title = "【Sample05】旗クリックでスプライトを表示する"

    Pg.preload = function() {
        this.Image.load('../assets/Jurassic.svg','Jurassic');
        this.Sound.load('../assets/Chill.wav','Chill');
        this.Image.load('../assets/cat.svg','Cat');
    }
    Pg.prepare = function() {
        St.stage = new Libs.Stage();
        St.stage.Image.add( Images.Jurassic );
        St.stage.Image.add( Sounds.Chill, { 'volume' : 100 } );
    }
    Pg.setting = function() {
        // フラグをクリックしたときの動作
        // whenFlagのなかでStageの『this』を使わずに、
        // Pのthisとして使うのであれば、アロー式（引数省略）で書いて
        // this.cat として明示的に使うことでもよい。
        // ここでは、this.cat は P.catと同じ意味である。
        St.stage.Event.whenFlag( _=> {
            // 旗クリックしたタイミングでネコのスプライトを作り、
            // コスチュームを１個登録する
            St.cat = new Libs.Sprite("Cat");
        });
        St.stage.Event.whenFlag( _=> {
            // コスチュームを１個登録する
            // whenFlagを定義した順番に実行されるので、
            // ここの『旗クリック』の処理ではネコのスプライトは作成済である。
            St.cat.Image.add( Images.Cat );
        });
    };

};

// ライブラリーをインポートして実行
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'
main(PlayGround, Libs, Storage, Images, Sounds);