/**
 * Sample20
 * 
 * 吹き出し(SAY, THINK)
 */
import {
    bubbleTextArr, 
    bubbleTextArr2, 
    MessageCat1Say, 
    MessageCat2Say,
    MessageCat2Think,
    MessageByeBye,
    MessageTAIJYO} from './bubble.js';

P.preload = async function preload() {
    this.loadImage('../assets/backdrop.png','BackDrop');
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.BackDrop );

    P.cat = new P.Sprite("Cat");
    P.cat.setRotationStyle( P.RotationStyle.LEFT_RIGHT );
    P.cat.addImage( P.images.Cat1 );
    P.cat.addImage( P.images.Cat2 );
    P.cat.position = {x: -150, y: 0}
    P.cat.direction = 90;
    P.cat2 = new P.Sprite("Cat2");
    P.cat2.setRotationStyle( P.RotationStyle.LEFT_RIGHT );
    P.cat2.addImage( P.images.Cat1 );
    P.cat2.addImage( P.images.Cat2 );
    P.cat2.direction = -90;
    P.cat2.position = {x: 150, y: 0}
}

P.setting = async function setting() {

    const BubbleScale = {scale:{x:100,y:100}};
    P.stage.whenFlag( async function() {
        // 1秒待つ
        await P.wait(1000);
        
        // (↓)順番にメッセージを送って待つ

        //(左) "こんにちは。良い天気ですね"
        await this.broadcastAndWait(MessageCat1Say, bubbleTextArr[0], 3); // 3 
        //(右) "💚こんにちは💚青空がよい感じですね"
        await this.broadcastAndWait(MessageCat2Say, bubbleTextArr2[0], 1); // 1
        //(右) "どこにおでかけですか"
        await this.broadcastAndWait(MessageCat2Say, bubbleTextArr2[1], 2); // 2
        //(左) "ちょっと近くのスーパーに買い物にいくんですよ"
        await this.broadcastAndWait(MessageCat1Say, bubbleTextArr[1], 1); // 1
        //(右) "あらあらそれはいいですね"
        await this.broadcastAndWait(MessageCat2Think, bubbleTextArr2[2], 4); // 4
        // お互いに退場
        await this.broadcastAndWait(MessageByeBye, "それでは、また！", 2); // 4
        this.broadcast(MessageTAIJYO);

    });
    P.cat.whenBroadcastReceived(MessageCat1Say, async function() {
        const me = this;
        // 上下に揺らす。
        await me.repeat(10, _=>{
            me.setXY(me.position.x, me.position.y+2);
        });
        await me.repeat(10, _=>{
            me.setXY(me.position.x, me.position.y-2);
        });
    });
    P.cat.whenBroadcastReceived(MessageCat1Say, async function(text,time) {
        // Cat の フキダシ を出す
        console.log('CAT フキダシ time='+time + " text="+text);
        if(time>0) {
            await this.sayForSecs(text, time, BubbleScale);
        }else{
            this.say(text);
        }
    });
    P.cat.whenBroadcastReceived(MessageTAIJYO, async function() {
        // Cat 退場
        console.log('Cat 退場');
        this.say('');
        this.direction *= -1;
        await this.while(true, _=>{
            this.moveSteps(5);
            if(this.isTouchingEdge()) {
                P.Loop.break();
            }
        });
        this.visible = false; 
    });
    P.cat2.whenBroadcastReceived(MessageTAIJYO, async function() {
        // Cat2 退場
        console.log('Cat2 退場');
        this.say('');
        this.direction *= -1;
        await this.while(true, _=>{
            this.moveSteps(5);
            if(this.isTouchingEdge()) {
                P.Loop.break();
            }
        });
        this.visible = false;         
    });
    P.cat2.whenBroadcastReceived(MessageCat2Say, async function() {
        const me = this;
        // 上下に揺らす。
        await me.repeat(10, _=>{
            me.setXY(me.position.x, me.position.y+2);
        });
        await me.repeat(10, _=>{
            me.setXY(me.position.x, me.position.y-2);
        });    
    });
    P.cat2.whenBroadcastReceived(MessageCat2Say, async function(text="", time=-1) {
        // Cat2 の フキダシ を出す
        console.log('CAT2 フキダシ time='+time + " text="+text);
        if(time>0) {
            await this.sayForSecs(text, time, BubbleScale);
        }else{
            this.say(text);
        }    
    });
    P.cat2.whenBroadcastReceived(MessageCat2Think, async function(text="", time=-1) {
        // Cat2 の フキダシ を出す
        console.log('CAT2 フキダシ time='+time + " text="+text);
        if(time>0) {
            await this.thinkForSecs(text, time);
        }else{
            this.think(text);
        }    
    });
    P.cat.whenBroadcastReceived(MessageByeBye, async function(text="", time=-1) {
        // それでは、という
        console.log('CAT フキダシ time='+time + " text="+text);
        await this.thinkForSecs(text, time);
    });
    P.cat2.whenBroadcastReceived(MessageByeBye, async function(text="", time=-1) {
        // それでは、という
        console.log('CAT2 フキダシ time='+time + " text="+text);
        await this.sayForSecs(text, time);
    });

}