/**
 * Sample19
 * 
 * 吹き出し(SAY, THINK)
 */
import {PlayGround, Library} from '../../build/likeScratchLib.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample19】いろんな文字列でフキダシ(言う, 思う)。20秒間。"

const Jurassic = "Jurassic";
const Cat1 = "Cat1";
const Cat2 = "Cat2";

let stage, cat, cat2;

import {bubble, bubbleTextArr, bubble2, bubbleTextArr2} from './bubble.js'

Pg.preload = async function preload( $pg ) {
    $pg.Image.load('../assets/Jurassic.svg', Jurassic );
    $pg.Image.load('../assets/cat.svg', Cat1 );
    $pg.Image.load('../assets/cat2.svg', Cat2 );
}
Pg.prepare = async function prepare() {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic );

    cat = new Lib.Sprite("Cat");
    cat.Image.add( Cat1 );
    cat.Image.add( Cat2 );
    cat.Motion.pointInDirection(75);
    cat2 = new Lib.Sprite("Cat2");
    cat2.Image.add( Cat1 );
    cat2.Image.add( Cat2 );
    cat2.Motion.pointInDirection(115);
    cat2.Motion.moveTo({x: -20, y: -120});
}

Pg.setting = async function setting() {
    const WALK_STEP = 1;
    cat.Event.whenFlag( async function( $this ) {
        $this.Control.forever( async _=>{
            $this.Motion.ifOnEdgeBounds();
            $this.Motion.moveSteps(WALK_STEP);
            if( bubble.exit === true) {
                Lib.Loop.break();
            }
        });
    });
    cat.Event.whenFlag( async function( $this ) {
        await Lib.wait(100)
        $this.Control.forever( async _=>{
            $this.Looks.nextCostume();
            await Lib.wait(100)
            if( bubble.exit === true) {
                Lib.Loop.break();
            }
        });
    });
    cat.Event.whenFlag( async function( $this ) {
        await Lib.wait(100)
        const MOVE_STEP = 2;
        const SCALE = {MIN:50, MAX:150};
        $this.Control.forever( async _=>{
            await $this.Control.forever( async _=>{
                $this.Looks.changeSizeBy({x:-MOVE_STEP, y: -MOVE_STEP});
                const scale = $this.Looks.getSize();
                if(scale.x < SCALE.MIN) Lib.Loop.break();
            });
            await $this.Control.forever( async _=>{
                $this.Looks.changeSizeBy({x: +MOVE_STEP, y: +MOVE_STEP});
                const scale = $this.Looks.getSize();
                if(scale.x > SCALE.MAX) Lib.Loop.break();
            });
            if( bubble.exit === true) {
                Lib.Loop.break();
            }
        });
    });
    cat.Event.whenFlag( async function( $this ) {
        let counter = 0;
        $this.Control.forever( async _=>{
            const text = bubbleTextArr[ Math.ceil(Math.random() * bubbleTextArr.length) - 1 ];
            if( $this.Sensing.isTouchingEdge() ) {
                counter += 1;
                counter = counter % 2;
            }
            if( counter == 0 ) {
                $this.Looks.say(text);

            }else{
                $this.Looks.think(text);

            }
            if( bubble.exit === true) {
                $this.Looks.say();
                Lib.Loop.break();
            }
            await Lib.wait(500)
        });
    });
    cat2.Event.whenFlag( async function( $this ) {
        $this.Control.forever( async _=>{
            $this.Motion.ifOnEdgeBounds();
            $this.Motion.moveSteps(WALK_STEP);
            if( bubble.exit === true) {
                Lib.Loop.break();
            }
        });
    });
    cat2.Event.whenFlag( async function( $this ) {
        let scale = {x: 60, y:60};
        $this.Control.forever( async _=>{
            const text = bubbleTextArr2[ Math.ceil(Math.random() * bubbleTextArr2.length) - 1 ]
            $this.Looks.think(text, {scale:scale});
            if( bubble2.exit === true) {
                $this.Looks.say();
                Lib.Loop.break();
            }
            await Lib.wait(500)
        });
    });

    stage.Event.whenFlag( async function() {
        await Lib.wait(20*1000); // 20秒たったらバブルループを終わらせる。
        bubble.exit = true;
        bubble2.exit = true;
    });

}