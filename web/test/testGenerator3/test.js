/*
  Generator function による複数スレッドの試行

*/
const sleep = async function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

let count = 0;
let _status = 'YIELD';
const func01 = async function*(obj) { 
    
    for(let i=0; i< 6; i++){
        //_status = 'RUNNING';
        console.log("【1】LOOP S("+i+")");
        count += 1;
        if(i == 0){
            console.log('【1】5秒停止')
            await sleep(5*1000);
        }
        _status = 'YIELD';
        console.log("【1】LOOP E("+i+")");
        yield;
    }
}

const func02 = async function*(obj) { 
    
    for(let i=0; i< 6; i++){
        //_status = 'RUNNING';
        console.log("---【2】LOOP S("+i+")");
        count += 1;
        if(i== 4){
            console.log('---【2】5秒停止')
            await sleep(5*1000);
        }
        _status = 'YIELD';
        console.log("---【2】LOOP E("+i+")");
        yield;
    }
}

const thread = [{f:func01(),done:false,running:false}, {f:func02(),done:false,running:false}];

const main = async () => {
    const f = func01();
    for(;;){
        for(const obj of thread){
            if(obj.running === false && obj.done === false){
                obj.running = true;
                // next().then() の形で 非同期として投げっぱなしにしつつ
                // 終わっていない next() は実行を抑止することができた。
                obj.f.next().then(rtn=>{
                    obj.running = false;
                    if(rtn.done){
                        obj.done = true;
                    }
                })
            }
        }
        await sleep(0.5*1000);
    }
}

main();