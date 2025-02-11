export async function setting() {
    // JSのスコープ規則どおり
    // setting()関数内のローカル変数を
    // whenFlag()関数内で利用できる。
    const y="Javascrip scope success"
    P.stage.whenFlag(async function(){
        console.log(y)
    });
    // 次のコードの場合、「BossaNova」のBGMが長いため
    // １曲が終わるまで threadを占有してしまう。
    // 現在の仕組みでは 他のスレッドが止まってしまいます。だめです。
    P.stage.whenFlag(async function(){  
        this.while(true, async _=>{
            await this.startSoundUntilDone();
        });
    });

    P.cat.whenFlag(async function(){
        await this.while(true, _=>{
            this.moveSteps(5);
            this.ifOnEdgeBounds();
        });
    })
    P.cat.whenFlag(async function(){
        await this.while(true, async _=>{
            this.nextCostume();
            await this.wait(0.1) 
        });
    })
}
