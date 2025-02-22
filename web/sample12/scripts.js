/**
 * Sample12
 * スプライト（CAT)を クリックした場所へ移動する
 */

import {PlayGround, Library, Storage, ImagePool, SoundPool} from '../../build/likeScratchLib.js'
const [Pg, Lib, St, Images, Sounds] = [PlayGround, Library, Storage, ImagePool, SoundPool]; // 短縮名にする

Pg.title = "【Sample12】クリックした場所へ移動する"

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Sound.load('../assets/Chill.wav','Chill');
    this.Image.load('../assets/cat.svg','Cat');
}
Pg.prepare = async function prepare() {
    St.stage = new Lib.Stage();
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Lib.Sprite("Cat");
    St.cat.Motion.gotoXY({x:0, y:0});
    St.cat.Image.add( Images.Cat );
}

Pg.setting = async function setting() {

    // ここはfunction式の中なので 【this】= P である
    // ここをアロー式にすると 【this】= window となる

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.Sound.add( Sounds.Chill, { 'volume' : 50 } );
    });

    St.stage.Event.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.Control.while(true, async _=>{
            await this.Sound.playUntilDone();
        });
    });
    St.stage.Event.whenClicked(async _=> {
        // アロー関数の中なので、【this】は 上の階層 の this = P である。
        const mousePosition = Lib.mousePosition;
        St.cat.Motion.gotoXY(mousePosition)
    });
}