/**
 * Sample16
 * スプライト() : 回転方向⇒左右のみ回転 
 * スプライト（CAT2) : 回転方向⇒自由に回転  
 * スプライト（CAT3) : 回転方向⇒回転しない
 * 
 * 各スプライトはマウスポインターに向いて追いかける。
 * ５秒ごとに元の位置に戻る。
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage("stage");
    P.stage.addImage( P.images.Jurassic );
    P.cat1 = new P.Sprite("Cat1");
    P.cat1.addImage( P.images.Cat );
    P.cat1.setPosition( -P.stageWidth/4, +P.stageHeight/4 );
    P.cat1.effect.color = 50;
    P.cat1.setRotationStyle( P.RotationStyle.LEFT_RIGHT );

    P.cat2 = new P.Sprite("Cat2");
    P.cat2.addImage( P.images.Cat );
    P.cat2.setPosition( 0, 0 );

    P.cat3 = new P.Sprite("Cat3");
    P.cat3.addImage( P.images.Cat );
    P.cat3.setPosition( P.stageWidth /4, -P.stageHeight/4 );
    P.cat3.effect.color = 100;
    P.cat3.setRotationStyle( P.RotationStyle.DONT_ROTATE );
}

P.setting = async function setting() {

    P.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });

    P.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    const WAIT_TIME = 5000;//5秒
    P.stage.whenFlag(async function(){
        this.while(true, async _=>{
            await P.wait(WAIT_TIME);
            P.cat1.setPosition( -P.stageWidth/4, +P.stageHeight/4 );
            P.cat2.setPosition( 0, 0 );
            P.cat3.setPosition( P.stageWidth /4, -P.stageHeight/4 );
        });
    });

    const CAT_WALK_STEP = 2;
    P.cat1.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });

    P.cat2.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });

    P.cat3.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });
}