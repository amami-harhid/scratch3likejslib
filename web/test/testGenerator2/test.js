/*
  Generator function の確認
    yeild にいたっていないタイミングで next() をしたらどうなるか？
    結果： sleepしているタイミングで next()をした場合、エラーにはならない。
    next()が蓄積していき、sleepが解除された時点にて 蓄積したnext()が一斉に連続して実行される。

    結果２： await next() とすることで、１回のnextが終わるまで待ってくれる。

*/
const sleep = async function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

let count = 0;
let _status = 'YIELD';
const func01 = async function*(obj) { 
    
    for(let i=0; i< 10; i++){
        //_status = 'RUNNING';
        console.log("LOOP S("+i+")");
        count += 1;
        if(i == 4){
            await sleep(5*1000);
        }
        _status = 'YIELD';
        console.log("LOOP E("+i+")");
        yield;
    }
}

const main = async () => {
    const f = func01();
    let count = 0;
    for(;;){
        count +=1;
        console.log('next mae('+count+")")
        const r = await f.next();
        console.log('next ato('+count+")")
        if( r.done == true){
            break;
        }    
        await sleep(0.5*1000);
    }
}

main();