/**
 * Sample18
 * 
 * キーボード操作
 * 左矢印、右矢印で、シップが左右に動く。
 * スペースキーで 弾を発射（発射する弾はクローン）
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cross1.svg','Cross01');
    this.loadImage('../assets/cross2.svg','Cross02');
    this.loadSound('../assets/Pew.wav','Pew');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );

    P.cross = new P.Sprite("Cross");
    P.cross.position.y = -P.stageHeight/2 * 0.6 
    P.cross.addImage( P.images.Cross01 );
    P.cross.addImage( P.images.Cross02 );
    P.cross.setScale(100,100);
}

P.setting = async function setting() {

    P.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });
    P.cross.whenFlag(async function(){
        this.addSound( P.sounds.Pew, { 'volume' : 100 } );
    });

    P.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    const MoveSteps = 15;
    P.cross.whenFlag(async function(){
        this.direction = 90;
        this.while(true, async _=>{
            if(P.getKeyIsDown('RightArrow')){
                this.moveSteps(MoveSteps);
            }
            if(P.getKeyIsDown('LeftArrow')){
                this.moveSteps(-MoveSteps);
            }
        });
    });
    P.cross.whenFlag(async function(){
        this.while(true, async _=>{
            // 矢印キーを押しながら、スペースキーを検知させたい
            if(P.getKeyIsDown('Space')){
                this.soundPlay();
                const options = {scale:{x:20,y:20},direction:0}
                this.clone(options);
                //次をコメントアウトしているときは キー押下中連続してクローン作る  
                //await P.waitUntil( P.keyboard.isKeyNotPressed.bind(P.keyboard) );
                //【課題】↑ 
                // bind でエラーになる , Proxy に関係している様子
            }
        });
    });
    P.cross.whenCloned(async function(){
        const c = this; // <--- cross instance;
        const bounds = c.render.renderer.getBounds(c.drawableID);
        const height = Math.abs(bounds.top - bounds.bottom);
        c.position.y += height / 2;
        c.nextCostume();
        c.setVisible(true);
    });
    P.cross.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.while(true, async _=>{
            const x = this.position.x;
            const y = this.position.y;
            c.setXY(x,y+10);
            if(c.isTouchingEdge()){
                console.log('isTougingEdge')
                P.Loop.break();
            }
        });
        c.remove();
    });
    const TURN_RIGHT_DEGREE= 15;
    P.cross.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.while(true, async _=>{
            c.turnRight(TURN_RIGHT_DEGREE);
            if(c.isTouchingEdge()){
                console.log('isTougingEdge')
                P.Loop.break();
            }
        });
        c.remove();
    });
}