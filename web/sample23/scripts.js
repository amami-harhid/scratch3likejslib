/**
 * Sample23
 * 
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample23】テスト";

const Jurassic = "Jurassic";
const Cat = "Cat";

let stage, cat;

Pg.preload = async function preload( $this ) {

    $this.Image.load('../assets/Jurassic.svg', Jurassic );
    $this.Image.load('../assets/cat.svg', Cat );
}
Pg.prepare = async function prepare() {

    stage = new Lib.Stage();
    stage.Image.add( Jurassic );
    cat = new Lib.Sprite( "Cat" );
    cat.Image.add( Cat );
}

Pg.setting = async function setting() {

    stage.Event.whenFlag(async function( $this ){

        $this.Control.forever( async _=>{
            if(Lib.anyKeyIsDown()){
                // const V10 = Lib.getRandomValueInRange(10,20);
                // console.log(`V10=${V10}`);
                // const V02 = Lib.getRandomValueInRange(-1,1);
                // console.log(`V02=${V02}`);
                const V03 = Lib.getRandomValueInRange(-1.0,1.0);
                console.log(`V03=${V03}`);
            }
        });
    })

    cat.Event.whenFlag( async function( $this ){
        $this.Control.forever( async _=>{
            if(Lib.anyKeyIsDown()){
                console.log('AnyKeyIsDown');
            }
        });
    });
    

}