/**
 * Sample12
 * スプライト（CAT)を クリックした場所へ移動する
 */

import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample12】クリックした場所へ移動する"

const Jurassic = "Jurassic";
const Chill = "Chill";
const Cat = "Cat";

let stage, cat;

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg', Jurassic );
    this.Sound.load('../assets/Chill.wav', Chill );
    this.Image.load('../assets/cat.svg', Cat );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat = new Lib.Sprite("Cat");
    cat.Motion.gotoXY({x:0, y:0});
    cat.Image.add( Cat );
}

Pg.setting = async function setting() {

    // ここはfunction式の中なので 【this】= P である
    // ここをアロー式にすると 【this】= window となる

    stage.Event.whenFlag(async function*() {
        // function() の中なので、【this】はProxy(stage)である。
        await this.Sound.add( Chill );
        await this.Sound.setOption( Lib.SoundOption.VOLUME, 10 );
        while(true){
            await this.Sound.playUntilDone();
            yield;
        };
    });
    stage.Event.whenClicked(async function(){
        const mousePosition = Lib.mousePosition;
        cat.Motion.gotoXY(mousePosition)
    });
    cat.Event.whenFlag(async function(){
        this.Motion.gotoXY({x:0, y:0});
    });
}