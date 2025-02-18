/**
 * Sample13
 * スプライト（CAT) クリックした位置へ１秒で動く
 */
import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample13】クリックした位置へ１秒で動く"


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
    St.stage.whenClicked(async function(){
        // function() の中なので、【this】はProxy(stage)である。
        const mousePosition = Libs.mousePosition;
        await St.cat.glideToPosition( 1, mousePosition.x, mousePosition.y );
    });
}