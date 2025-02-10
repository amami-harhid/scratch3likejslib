export async function setting() {
    // JSのスコープ規則どおり
    // setting()関数内のローカル変数を
    // whenFlag()関数内で利用できる。
    const y="Javascrip scope success"
    P.stage.whenFlag(async function(){
        console.log(y)
    });
    P.stage.whenFlag(async function(){
        this.addSound( P.sounds.BossaNova , { 'volume' : 25 } );
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
