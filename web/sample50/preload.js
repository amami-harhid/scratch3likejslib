/**
 * Sample50 preload
 */
import {PlayGround} from '../../build/likeScratchLib.js'
const [Pg] = [PlayGround]; // 短縮名にする

Pg.title = "【Sample22】スピーチ機能：「お話しを終わるまで待つ」を続ける"

export async function preload() {
    Pg.Image.load('../assets/Jurassic.svg','Jurassic');
    Pg.Sound.load('../assets/Chill.wav','Chill');
    Pg.Image.load('../assets/cat.svg','Cat');
}
