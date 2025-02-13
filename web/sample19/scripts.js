/**
 * Sample19
 * 
 * 吹き出し(SAY, THINK)
 */
import {bubble, bubbleTextArr, bubble2, bubbleTextArr2} from './bubble.js';

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat1 );
    P.cat.addImage( P.images.Cat2 );
    P.cat.direction = 75;
    P.cat2 = new P.Sprite("Cat2");
    P.cat2.addImage( P.images.Cat1 );
    P.cat2.addImage( P.images.Cat2 );
    P.cat2.direction = 115;
    P.cat2.position = {x: -20, y: -120}
}

P.setting = async function setting() {
    const WALK_STEP = 1;
    P.cat.whenFlag( async function() {
        this.while(true, async _=>{
            this.ifOnEdgeBounds();
            this.moveSteps(WALK_STEP);
        });
    });
    P.cat.whenFlag( async function() {
        await P.wait(100)
        this.while(true, async _=>{
            this.nextCostume();
            await P.wait(100)
        });
    });
    P.cat.whenFlag( async function() {
        await P.wait(100)
        const MOVE_STEP = 2;
        const SCALE = {MIN:50, MAX:150};
        this.while(true, async _=>{
            await this.while(true, async _=>{
                this.setScale(this.scale.x - MOVE_STEP, this.scale.y - MOVE_STEP);
                if(this.scale.x < SCALE.MIN) P.Loop.break();
            });
            await this.while(true, async _=>{
                this.setScale(this.scale.x + MOVE_STEP, this.scale.y + MOVE_STEP);
                if(this.scale.x > SCALE.MAX) P.Loop.break();
            });
        });
    });
    P.cat.whenFlag( async function() {
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
                P.Loop.break();
            }
            await P.wait(500)
        });
    });
    P.cat2.whenFlag( async function() {
        this.while(true, async _=>{
            this.ifOnEdgeBounds();
            this.moveSteps(WALK_STEP);
        });
    });
    P.cat2.whenFlag( async function() {
        let scale = {x: 60, y:60};
        this.while(true, async _=>{
            const text = bubbleTextArr2[ Math.ceil(Math.random() * bubbleTextArr2.length) - 1 ]
            this.think(text, {scale:scale});
            if( bubble2.exit === true) {
                this.say();
                P.Loop.break();
            }
            await P.wait(500)
        });
    });

    P.stage.whenFlag( async function() {
        await P.wait(20*1000); // 20秒たったらバブルループを終わらせる。
        bubble.exit = true;
        bubble2.exit = true;
    });

}