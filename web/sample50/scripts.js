/**
 * Sample23
 * 
 * Stage, Sprite クラスを継承した サブクラスを作る
 * 
 * 未完成
 */
import {MyStage} from './stage.js'
import {MyCat} from './cat.js'

P.preload = async function preload() {
    this.loadSound('../assets/Boing.wav','Boing');
    this.loadSound('../assets/Cat.wav','Cat');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadSound('../assets/Bossa Nova.wav','BossaNova')
    this.loadImage('../assets/cat.svg','Cat1');
    this.loadImage('../assets/cat2.svg','Cat2');
    this.loadImage('../assets/Jurassic.svg','Jurassic');
}
P.prepare = async function prepare() {
    P.stage = new MyStage( "stage" );
    P.stage.addImage( P.images.Jurassic );
    P.spriteA = new MyCat( "spriteA", {'effect': {'color': 100}});
    P.spriteA.addImage( P.images.Cat1 );
    P.spriteA.addImage( P.images.Cat2 );
    P.spriteA.position = { x:0, y:0 };
    P.spriteA.scale = { x:150, y:150 };
    P.spriteA.direction = Math.random() * 360;
}

P.setting = async function setting() {

    P.stage.whenFlag(async function(){
        // TODO addSound 処理時間が長いとき、登録順が逆になるときがある。なんとかしたい。
        this.addSound( P.sounds.Chill, { 'volume' : 125 } );
        this.addSound( P.sounds.BossaNova , { 'volume' : 25 } );
        this.while(true, async _=>{
            // 終わるまで音を鳴らす
            await this.startSoundUntilDone();
        })
    })
    P.stage.whenClicked( async function() {
        // 横向きに反転させる
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
        this.nextSound();
    });
    P.spriteA.whenFlag(async function(){
        this.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
        this.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
        const MoveStepsA = 10;
        const s = P.spriteA;
        this.while(true, _=>{
            s.isTouchingEdge(function(){
                s.soundPlay();
                const optionsX = {
                    'position':{
                        x: (Math.random() - 0.5) * 300, 
                        y: (Math.random() - 0.5) * 200
                    }, 
                    'scale':{x:100, y:100}, 
                    effect:{'color' : 50}
                };
                s.clone(optionsX).then(async (v)=>{
                    P.stage.update();
                    P.stage.draw();
                    //console.log('SpriteA クローンを作った')
                    const x = v;
                    x.life = 1000; // およそ １秒間
                    const cloneSteps = 10;
                    setTimeout(async function(){
                        for(;;) {
                            x.moveSteps(cloneSteps);
                            x.ifOnEdgeBounds();
                            x.nextCostume();
                            x.scale.x -= 0.5;
                            x.scale.y -= 0.5;    
                            await P.Utils.wait(P.wait_time);
                        }                        
                    })
                }); 
            });
            s.moveSteps(MoveStepsA);
            s.ifOnEdgeBounds();
            s.nextCostume();
        });
    });
    const optionsB = {'position': { x: P.spriteA.position.x+50, y: P.spriteA.position.y }}    
    P.spriteA.whenFlag(async function(){
        this.clone(optionsB);
    });
    P.spriteA.whenCloned(async function(){
        const v = this;
        v.clearEffect();
        v.scale = { x:100, y:100 };
        v.direction = Math.random() * 360;
        v.whenClicked( async function() {
            const scale = v.scale;
            v.setScale( scale.x * -1, scale.y );
        });
        const s = v;
        const _moveSteps = 10;
        s.while(true, async _=>{
            s.moveSteps(_moveSteps);
            s.ifOnEdgeBounds();
            s.nextCostume();
            await P.Utils.wait(P.wait_time);
        });
    });

    P.spriteA.whenClicked( async function() {
        if( P.MoveStepsA == 3 ) {
            P.MoveStepsA = 0;
        }else{
            P.MoveStepsA = 3;
        }
    });
}