/**
 * Sample16
 * スプライト() : 回転方向⇒左右のみ回転 
 * スプライト（CAT2) : 回転方向⇒自由に回転  
 * スプライト（CAT3) : 回転方向⇒回転しない
 * 
 * 各スプライトはマウスポインターに向いて追いかける。
 * ５秒ごとに元の位置に戻る。
 */
const [Libs,P,Pool] = [likeScratchLib.libs, likeScratchLib.process, likeScratchLib.pool];
P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
}
P.prepare = async function prepare() {
    Pool.stage = new Libs.Stage("stage");
    Pool.stage.addImage( P.images.Jurassic );
    Pool.cat1 = new Libs.Sprite("Cat1");
    Pool.cat1.addImage( P.images.Cat );
    Pool.cat1.setPosition( -P.stageWidth/4, +P.stageHeight/4 );
    Pool.cat1.effect.color = 50;
    Pool.cat1.setRotationStyle( Libs.RotationStyle.LEFT_RIGHT );

    Pool.cat2 = new Libs.Sprite("Cat2");
    Pool.cat2.addImage( P.images.Cat );
    Pool.cat2.setPosition( 0, 0 );

    Pool.cat3 = new Libs.Sprite("Cat3");
    Pool.cat3.addImage( P.images.Cat );
    Pool.cat3.setPosition( P.stageWidth /4, -P.stageHeight/4 );
    Pool.cat3.effect.color = 100;
    Pool.cat3.setRotationStyle( Libs.RotationStyle.DONT_ROTATE );
}

P.setting = async function setting() {

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はstageである。
        this.addSound( P.sounds.Chill, { 'volume' : 50 } );
    });

    Pool.stage.whenFlag(async function() {
        // function() の中なので、【this】はProxy(stage)である。
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });
    const WAIT_TIME = 5000;//5秒
    Pool.stage.whenFlag(async function(){
        this.while(true, async _=>{
            await Libs.wait(WAIT_TIME);
            Pool.cat1.setPosition( -P.stageWidth/4, +P.stageHeight/4 );
            Pool.cat2.setPosition( 0, 0 );
            Pool.cat3.setPosition( P.stageWidth /4, -P.stageHeight/4 );
        });
    });

    const CAT_WALK_STEP = 2;
    Pool.cat1.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });

    Pool.cat2.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });

    Pool.cat3.whenFlag(async function(){
        this.while(true, async _=>{
            this.pointToMouse();
            this.moveSteps(CAT_WALK_STEP);
        });
    });
}