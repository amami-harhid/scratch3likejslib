/**
 * Sample19
 * 
 * 吹き出し(SAY, THINK)
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

Pg.title = "【Sample19】いろんな文字列でフキダシ(言う, 思う)。20秒間。"

import {bubble, bubbleTextArr, bubble2, bubbleTextArr2} from './bubble.js'

Pg.preload = async function preload() {
    this.Image.load('../assets/Jurassic.svg','Jurassic');
    this.Image.load('../assets/cat.svg','Cat1');
    this.Image.load('../assets/cat2.svg','Cat2');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.Image.add( Images.Jurassic );

    St.cat = new Libs.Sprite("Cat");
    St.cat.Image.add( Images.Cat1 );
    St.cat.Image.add( Images.Cat2 );
    St.cat.Motion.pointInDirection(75);
    St.cat2 = new Libs.Sprite("Cat2");
    St.cat2.Image.add( Images.Cat1 );
    St.cat2.Image.add( Images.Cat2 );
    St.cat2.Motion.pointInDirection(115);
    St.cat2.Motion.moveTo({x: -20, y: -120});
}

Pg.setting = async function setting() {
    const WALK_STEP = 1;
    St.cat.Event.whenFlag( async function() {
        this.C.forever( async _=>{
            this.Motion.ifOnEdgeBounds();
            this.Motion.moveSteps(WALK_STEP);
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat.Event.whenFlag( async function() {
        await Libs.wait(100)
        this.C.forever( async _=>{
            this.Looks.nextCostume();
            await Libs.wait(100)
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat.Event.whenFlag( async function() {
        await Libs.wait(100)
        const MOVE_STEP = 2;
        const SCALE = {MIN:50, MAX:150};
        this.C.forever( async _=>{
            await this.C.forever( async _=>{
                this.Looks.setSize({x:this.$_scale.x - MOVE_STEP, y:this.$_scale.y - MOVE_STEP});
                if(this.$_scale.x < SCALE.MIN) Libs.Loop.break();
            });
            await this.C.forever( async _=>{
                this.Looks.setSize({x:this.$_scale.x + MOVE_STEP, y:this.$_scale.y + MOVE_STEP});
                if(this.$_scale.x > SCALE.MAX) Libs.Loop.break();
            });
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat.Event.whenFlag( async function() {
        let counter = 0;
        this.C.forever( async _=>{
            const text = bubbleTextArr[ Math.ceil(Math.random() * bubbleTextArr.length) - 1 ];
            if( this.Sensing.isTouchingEdge() ) {
                counter += 1;
                counter = counter % 2;
            }
            if( counter == 0 ) {
                this.say(text);

            }else{
                this.Looks.think(text);

            }
            if( bubble.exit === true) {
                this.say();
                Libs.Loop.break();
            }
            await Libs.wait(500)
        });
    });
    St.cat2.Event.whenFlag( async function() {
        this.C.forever( async _=>{
            this.Motion.ifOnEdgeBounds();
            this.Motion.moveSteps(WALK_STEP);
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat2.Event.whenFlag( async function() {
        let scale = {x: 60, y:60};
        this.C.forever( async _=>{
            const text = bubbleTextArr2[ Math.ceil(Math.random() * bubbleTextArr2.length) - 1 ]
            this.Looks.think(text, {scale:scale});
            if( bubble2.exit === true) {
                this.Looks.say();
                Libs.Loop.break();
            }
            await Libs.wait(500)
        });
    });

    St.stage.Event.whenFlag( async function() {
        await Libs.wait(20*1000); // 20秒たったらバブルループを終わらせる。
        bubble.exit = true;
        bubble2.exit = true;
    });

}