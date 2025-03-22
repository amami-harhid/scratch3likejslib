/**
 * Sample50 preload
 */
import {PlayGround, Library} from '../../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample22】スピーチ機能：「お話しを終わるまで待つ」を続ける"

import { Jurassic, Chill, Cat } from '../def/constants.js';

export async function preload() {
    this.Image.load('../assets/Jurassic.svg',Jurassic);
    this.Sound.load('../assets/Chill.wav',Chill);
    this.Image.load('../assets/cat.svg',Cat);
}
