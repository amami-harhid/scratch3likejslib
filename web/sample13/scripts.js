/**
 * Sample13
 * スプライト（CAT) クリックした位置へ１秒で動く
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample13】クリックした位置へ１秒で動く"

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
    cat.Image.add( Cat );
}

Pg.setting = async function setting() {

    /** 旗をクリックしたときのステージのイベント */
    stage.Event.whenFlag(async function() {
        // 【this】はstageである。
        await this.Sound.add( Chill );
        this.Sound.setOption( Lib.SoundOption.VOLUME, 50 )
    });
    /** 旗をクリックしたときのステージのイベント */
    stage.Event.whenFlag(async function*() {
        // function() の中なので、【this】はProxy(stage)である。
        while(true){
            await this.Sound.playUntilDone();
            yield;
        };
    });

    /** ステージをクリックしたときのステージイベント */
    stage.Event.whenClicked(async function( ){
        // function() の中なので、【this】はProxy(stage)である。
        const mousePosition = Lib.mousePosition;
        // ステージイベント処理の中でネコを動かす
        await cat.Motion.glideToPosition( 1, mousePosition );
    });
    /** 旗をクリックしたときのネコのイベント */
    cat.Event.whenFlag(async function(){
        this.Motion.gotoXY({x:0, y:0});

    });
}