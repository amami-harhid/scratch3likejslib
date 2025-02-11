/**
 * Sample08
 * スプライトを 動かす( 端に触れたら ミャーと鳴く)
 */

P.preload = async function preload() {
    this.loadImage('../assets/Jurassic.svg','Jurassic');
    this.loadSound('../assets/Chill.wav','Chill');
    this.loadImage('../assets/cat.svg','Cat');
    this.loadSound('../assets/Cat.wav','Mya');
}
P.prepare = async function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
}
P.setting = async function setting() {

    P.stage.whenFlag(async function(){
        console.log('stage whenFlag')
        console.log(this);
        await this.addSound( P.sounds.Chill, { 'volume' : 100 } );
        console.log('after addSound in stage whenFlag');

        this.while(true, async _=>{
            await this.startSoundUntilDone();
        })
    });
    P.cat.whenFlag( async function(){
        console.log('cat whenFlag')
        console.log(this);
        await this.addSound( P.sounds.Mya, { 'volume' : 50 } );
        console.log('after addSound in cat whenFlag');
        // 「左右」に動く。端に触れたら跳ね返る。
        this.while( true, async _=> {
            this.moveSteps(catStep);
            this.ifOnEdgeBounds();
            this.isTouchingEdge(_=>{
                this.soundPlay()
            });
        });
    });

    const catStep = 5;

/**
 * 複数の P.cat.whenFlag があり、ひとつの whenFlag()の中に、
 * this.while() があるとき、ひとつしか動かない。
 * ==> EntityのID をもつスレッドが２個以上あるとき、最初にみつけたスレッドの子Aの子Bとして
 *     whileスレッドを登録してしまう。そうすると 子Aが動かなくなる。
 * Hatsの定義ごとに スレッドIDを付与して他のスレッドに影響を与えないようにしたい。
 * ==> Obj.threadId として Hatを受けたときに UUIDを振る。
 * ==> Proxy で Entityを包みこみ、methodは Proxy経由で Entityインスタンスへ流す
 * ==> Proxyインスタンスが Hatsの中での 『this』にあたるようにする
 * ==> 2025/2/11 22:00 対応済。
 * ==> 一応、動作する。クローンされたときのHatでは対応漏れている。
 * 
 * また、this.while() に await をつけなくてもよい気がするが
 * 実際には await をつけないときは 動かない（すぐに動きが終わる）。
 * これはHatスレッドが終わると 子スレッドも終わる制御になっているから。
 * 親スレッドは done のときでも 子がdoneでないと終わってはいけなそう。
 * ==> 2025/2/11 18:40 対応済。
 */

/*
    // フラグクリック
    P.cat.whenFlag( async function() {
    });
 
    // フラグクリック
    P.cat.whenFlag( async function() {
        // 端に触れたらニャーと鳴く。
        await this.while( true, async _=> {
            this.isTouchingEdge(_=>{
                this.soundPlay()
            });
        });
    });
 */

}