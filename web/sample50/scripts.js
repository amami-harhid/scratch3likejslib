/**
 * Sample23
 * 
 * Stage, Sprite クラスを継承した サブクラスを作る
 * 
 * 未完成  
 * クローンを作るときは『クローンされたとき』の処理は
 * 必ず HAT(『クローンされたとき』)で記述するべき。
 * Sprite#cloneThen() の書き方は混乱の元なので禁止するべき。
 * 
 * Sprite#clone() は promise とはしないこと。
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
    P.stage.whenFlag(async function(){
        await P.Utils.wait(500);
        let pitch = 1;
        let picthPower = 0.01;
        this.while(true, async function(){
            pitch += picthPower;
            if ( pitch > 3 || pitch < 0.5 ) picthPower *= -1;
            P.spriteB.setSoundPitch( pitch );
            P.spriteC.setSoundPitch( pitch );
            P.spriteB.setSoundPitch( pitch);
            P.spriteC.setSoundPitch( pitch);
        });
    });
    P.stage.whenClicked( async function() {
        // 横向きに反転させる
        const scale = this.scale;
        this.setScale( scale.x * -1, scale.y );
        this.nextSound();
    });
    P.spriteA.whenFlag(async function(){
        this.addSound( P.sounds.Boing , { 'volume' : 100 } ); 
        this.addSound( P.sounds.Cat , { 'volume' : 100 } ); 
    });
    P.spriteA.whenFlag(async function(){
        this.while(true, _=>{
            if(this.isTouchingEdge()){
                this.soundSwitch(P.sounds.Cat)
                this.soundPlay();
            }
        });
    });
    P.spriteA.whenFlag(async function(){
        const MoveStepsA = 10;
        const s = this;
        this.while(true, _=>{
            if(s.isTouchingEdge()){
                const optionsX = {
                    'position':{
                        x: (Math.random() - 0.5) * 300, 
                        y: (Math.random() - 0.5) * 200
                    }, 
                    'scale':{x:100, y:100}, 
                    effect:{'color' : 20}
                };
                s.clone(optionsX).then(async v => {
                    v.visible = true;
//                    console.log(v);
//                    P.stage.update();
//                    P.stage.draw();
                    //console.log('SpriteA クローンを作った')
                    const x = v;
                    x.life = 2*1000; // およそ １０秒間
                    const cloneSteps = 10;
                    while(x.isAlive()){
                        x.moveSteps(cloneSteps);
                        x.ifOnEdgeBounds();
                        x.nextCostume();
                        x.scale.x -= 0.5;
                        x.scale.y -= 0.5;
                        await P.wait(33);    
                    }
                    x.soundSwitch(P.sounds.Boing)
                    x.soundPlay();
                }); 
            }
            s.moveSteps(MoveStepsA);
            s.ifOnEdgeBounds();
            s.nextCostume();
        });
    });
    const optionsB = {'position': { x: P.spriteA.position.x+50, y: P.spriteA.position.y }}    

    P.spriteA.whenClicked( async function() {
        if( P.MoveStepsA == 3 ) {
            P.MoveStepsA = 0;
        }else{
            P.MoveStepsA = 3;
        }
    });

    P.stage.whenRightNow(async function(){
        
        P.spriteA.clone(optionsB).then(async v=>{ //<--- アロー関数は不可です
            console.log(this);
            v.visible = true;
            P.spriteB = v;
            //v.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
            //v.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
            v.clearEffect();
            v.scale = { x:100, y:100 };
            v.direction = Math.random() * 360;
            v.whenClicked( async function() {
                const scale = v.scale;
                v.setScale( scale.x * -1, scale.y );
            });
            const _moveSteps = 2;
            while(v.isAlive()){
                v.moveSteps(_moveSteps);
                v.ifOnEdgeBounds();
                v.nextCostume();
                await P.wait(33);
            }
        });
        P.spriteA.clone().then(async v=>{  //<--- アロー関数
            P.spriteC = v;
            v.visible = true;
            //v.addSound( P.sounds.Boing , { 'volume' : 25 } ); 
            //v.addSound( P.sounds.Cat , { 'volume' : 25 } ); 
        
            v.position = {x: P.spriteA.position.x-200, y: P.spriteA.position.y+20 };
            v.scale = {x:50, y:50};
            v.direction = Math.random() * 360;
            v.clearEffect();
            v.whenClicked( async function() {
                const scale = v.scale;
                v.setScale( scale.x * -1, scale.y );
            });
            P.stage.update();
            P.stage.draw();
            const MoveSteps = 1;
            while(v.isAlive()){
                v.moveSteps(MoveSteps);
                v.ifOnEdgeBounds();
                v.nextCostume();
                await P.wait(33);
            }
        });
            
        
    });
}