/**
 * Sample50 prepare
 */
import {Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'
const [St] = [Storage]; // 短縮名にする

export async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );
    St.cat = new Libs.Sprite("Cat", {scale:{x:200,y:200}});//サイズを２倍にしています
    St.cat.Image.add( Images.Cat );
}
