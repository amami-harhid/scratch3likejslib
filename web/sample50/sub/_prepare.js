/**
 * Sample50 prepare
 */
import {PlayGround, Library} from '../../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

import {Jurassic, Chill, Cat} from '../def/constants.js';
import {Obj} from '../def/variables.js';

export async function prepare() {
    Obj.stage = new Lib.Stage();
    Obj.stage.Image.add( Jurassic );
    Obj.stage.Sound.add( Chill );
    Obj.cat = new Lib.Sprite( Cat );
    Obj.cat.Image.add( Cat );
    //サイズを２倍にしています
    Obj.cat.Looks.setSize({x:200,y:200});
}
