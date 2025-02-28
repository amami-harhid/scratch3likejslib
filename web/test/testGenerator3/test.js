/*
  Generator function による複数スレッドの試行

*/
const sleep = async function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

class TestA {
    speak(str) {
        console.log('speak!! ('+str+")");
    }
}

let count = 0;
let _status = 'YIELD';
const func01 = async function*() { 
    
    for(let i=0; i< 6; i++){
        //_status = 'RUNNING';
        console.log("【1】LOOP S("+i+")");
        count += 1;
        if(i == 0){
            console.log('【1】5秒停止')
            console.log(this)
            this.speak(`【1】(${i})`);
            await sleep(0.5*1000);
        }
        _status = 'YIELD';
        console.log("【1】LOOP E("+i+")");
        //await sleep(500);
        //yield;
    }
}

const func02 = async function*() { 
    for(let i=0; i< 6; i++){
        //_status = 'RUNNING';
        console.log("---【2】LOOP S("+i+")");
        count += 1;
        if(i== 4){
            console.log('---【2】5秒停止')
            this.speak(`---【2】(${i})`);
            await sleep(5*1000);
        }
        _status = 'YIELD';
        console.log("---【2】LOOP E("+i+")");
        //await sleep(500);
        if(yield) break;
    }
}
const testA = new TestA();
const thread = [{f:func01.bind(testA)(),done:false,running:false}, {f:func02.bind(testA)(),done:false,running:false}];

const main = async () => {
    for(;;){
        for(const obj of thread){
            if(obj.running === false && obj.done === false){
                obj.running = true;
                // next().then() の形で 非同期として投げっぱなしにしつつ
                // 終わっていない next() は実行を抑止することができた。
                obj.f.next(false).then(rtn=>{
                    obj.running = false;
                    if(rtn.done){
                        obj.done = true;
                    }
                })
            }
        }
        const _arr = thread.filter(e=> e.done == false )
        if(_arr.length == 0) break;
        await sleep(1000);
    }
    console.log('END');
}

main();