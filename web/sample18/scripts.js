/**
 * Sample18
 * 
 * キーボード操作
 * 左矢印、右矢印で、シップが左右に動く。
 * スペースキーで 弾を発射（発射する弾はクローン）
 */
const [Libs,P,Pool] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cross1.svg','Cross01');
    this.loadImage('../assets/cross2.svg','Cross02');
    this.loadSound('../assets/Pew.wav','Pew');
}
P.prepare = async function prepare() {
    Pool.stage = new Libs.Stage("stage");
    Pool.stage.addImage( P.images.Jurassic );

    Pool.cross = new Libs.Sprite("Cross");
    Pool.cross.position.y = -P.stageHeight/2 * 0.6 
    Pool.cross.addImage( P.images.Cross01 );
    Pool.cross.addImage( P.images.Cross02 );
    Pool.cross.setScale(100,100);
}

P.setting = async function setting() {

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 20 } );
    });
    Pool.cross.whenFlag(async function(){
        this.addSound( P.sounds.Pew, { 'volume' : 100 } );
    });

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    const MoveSteps = 15;
    Pool.cross.whenFlag(async function(){
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
    Pool.cross.whenFlag(async function(){
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
    Pool.cross.whenCloned(async function(){
        const c = this; // <--- cross instance;
        const bounds = c.render.renderer.getBounds(c.drawableID);
        const height = Math.abs(bounds.top - bounds.bottom);
        c.position.y += height / 2;
        c.nextCostume();
        c.setVisible(true);
    });
    Pool.cross.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.while(true, async _=>{
            const x = this.position.x;
            const y = this.position.y;
            c.setXY(x,y+10);
            if(c.isTouchingEdge()){
                Libs.Loop.break();
            }
        });
        c.remove();
    });
    const TURN_RIGHT_DEGREE= 15;
    Pool.cross.whenCloned( async function() {
        const c = this; // <--- cross instance;
        // while の後に処理があるときは await 忘れないようにしましょう
        await c.while(true, async _=>{
            if(c.isTouchingEdge()){
                Libs.Loop.break();
            }
        });
        c.remove();
    });
}