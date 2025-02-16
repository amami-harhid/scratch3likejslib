/**
 * Sample19
 * 
 * 吹き出し(SAY, THINK)
 */
const [Libs,P,Pool] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
import {bubble, bubbleTextArr, bubble2, bubbleTextArr2} from './bubble.js';

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
}
P.prepare = async function prepare() {
    Pool.stage = new Libs.Stage("stage");
    Pool.stage.addImage( P.images.Jurassic );

    Pool.cat = new Libs.Sprite("Cat");
    Pool.cat.addImage( P.images.Cat1 );
    Pool.cat.addImage( P.images.Cat2 );
    Pool.cat.direction = 75;
    Pool.cat2 = new Libs.Sprite("Cat2");
    Pool.cat2.addImage( P.images.Cat1 );
    Pool.cat2.addImage( P.images.Cat2 );
    Pool.cat2.direction = 115;
    Pool.cat2.position = {x: -20, y: -120}
}

P.setting = async function setting() {
    const WALK_STEP = 1;
    Pool.cat.whenFlag( async function() {
        this.while(true, async _=>{
            this.ifOnEdgeBounds();
            this.moveSteps(WALK_STEP);
        });
    });
    Pool.cat.whenFlag( async function() {
        await Libs.wait(100)
        this.while(true, async _=>{
            this.nextCostume();
            await Libs.wait(100)
        });
    });
    Pool.cat.whenFlag( async function() {
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
        });
    });
    Pool.cat.whenFlag( async function() {
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
    Pool.cat2.whenFlag( async function() {
        this.while(true, async _=>{
            this.ifOnEdgeBounds();
            this.moveSteps(WALK_STEP);
        });
    });
    Pool.cat2.whenFlag( async function() {
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

    Pool.stage.whenFlag( async function() {
        await Libs.wait(20*1000); // 20秒たったらバブルループを終わらせる。
        bubble.exit = true;
        bubble2.exit = true;
    });

}