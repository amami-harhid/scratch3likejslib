/**
 * Sample19
 * 
 * 吹き出し(SAY, THINK)
 */
import '../../build/likeScratchLib.js'
const SLIB = likeScratchLib;
const [Pg, St, Libs, Images, Sounds] = [SLIB.PlayGround, SLIB.Storage, SLIB.Libs, SLIB.Images, SLIB.Sounds];

Pg.title = "【Sample19】いろんな文字列でフキダシ(言う, 思う)。20秒間。"

import {bubble, bubbleTextArr, bubble2, bubbleTextArr2} from './bubble.js'

Pg.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
}
Pg.prepare = async function prepare() {
    St.stage = new Libs.Stage("stage");
    St.stage.addImage( Images.Jurassic );

    St.cat = new Libs.Sprite("Cat");
    St.cat.addImage( Images.Cat1 );
    St.cat.addImage( Images.Cat2 );
    St.cat.direction = 75;
    St.cat2 = new Libs.Sprite("Cat2");
    St.cat2.addImage( Images.Cat1 );
    St.cat2.addImage( Images.Cat2 );
    St.cat2.direction = 115;
    St.cat2.position = {x: -20, y: -120}
}

Pg.setting = async function setting() {
    const WALK_STEP = 1;
    St.cat.whenFlag( async function() {
        this.while(true, async _=>{
            this.ifOnEdgeBounds();
            this.moveSteps(WALK_STEP);
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat.whenFlag( async function() {
        await Libs.wait(100)
        this.while(true, async _=>{
            this.nextCostume();
            await Libs.wait(100)
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat.whenFlag( async function() {
        await Libs.wait(100)
        const MOVE_STEP = 2;
        const SCALE = {MIN:50, MAX:150};
        this.while(true, async _=>{
            await this.while(true, async _=>{
                this.setScale(this.scale.x - MOVE_STEP, this.scale.y - MOVE_STEP);
                if(this.scale.x < SCALE.MIN) Libs.Loop.break();
            });
            await this.while(true, async _=>{
                this.setScale(this.scale.x + MOVE_STEP, this.scale.y + MOVE_STEP);
                if(this.scale.x > SCALE.MAX) Libs.Loop.break();
            });
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat.whenFlag( async function() {
        let counter = 0;
        this.while(true, async _=>{
            const text = bubbleTextArr[ Math.ceil(Math.random() * bubbleTextArr.length) - 1 ];
            if( this.ifOnEdgeBounds() ) {
                counter += 1;
                counter = counter % 2;
            }
            if( counter == 0 ) {
                this.say(text);

            }else{
                this.think(text);

            }
            if( bubble.exit === true) {
                this.say();
                Libs.Loop.break();
            }
            await Libs.wait(500)
        });
    });
    St.cat2.whenFlag( async function() {
        this.while(true, async _=>{
            this.ifOnEdgeBounds();
            this.moveSteps(WALK_STEP);
            if( bubble.exit === true) {
                Libs.Loop.break();
            }
        });
    });
    St.cat2.whenFlag( async function() {
        let scale = {x: 60, y:60};
        this.while(true, async _=>{
            const text = bubbleTextArr2[ Math.ceil(Math.random() * bubbleTextArr2.length) - 1 ]
            this.think(text, {scale:scale});
            if( bubble2.exit === true) {
                this.say();
                Libs.Loop.break();
            }
            await Libs.wait(500)
        });
    });

    St.stage.whenFlag( async function() {
        await Libs.wait(20*1000); // 20秒たったらバブルループを終わらせる。
        bubble.exit = true;
        bubble2.exit = true;
    });

}