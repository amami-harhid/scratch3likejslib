/**
 * Sample12
 * スプライト（CAT)を クリックした場所へ移動する
 */

import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample12】クリックした場所へ移動する"

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat");
    St.cat.position.x = 0;
    St.cat.position.y = 0;
    St.cat.addImage( Images.Cat );
}

Pg.setting = async function setting() {

    // ここはfunction式の中なので 【this】= P である
    // ここをアロー式にすると 【this】= window となる

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    St.stage.whenClicked(async _=> {
        // アロー関数の中なので、【this】は 上の階層 の this = P である。
        const x = Libs.mousePosition.x;
        const y = Libs.mousePosition.y;
        St.cat.moveTo(x,y)
    });
}