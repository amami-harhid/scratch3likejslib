export async function setting() {
    // JSのスコープ規則どおり
    // setting()関数内のローカル変数を
    // whenFlag()関数内で利用できる。
    let x = 3;
    const y="xxxx"

    P.stage.whenFlag(async function(){
        console.log(y)
    });

    P.cat.whenFlag(async function(){
        await this.while(_=>x<1000, _=>{
            console.log("-----"+x);
            x+=1;
            this.moveSteps(10);
            this.ifOnEdgeBounds();
        });
    })
}
