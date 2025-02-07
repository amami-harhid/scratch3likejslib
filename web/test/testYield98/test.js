import {sleep} from './sleep.js'
/*
最初の５回は 1秒ごと、以降は「0.5ms」ごとで一瞬で終わる。
*/
const tArr = [];
const g = function* (){
    let x=0;
    let t = 0;
    let tPrev = 0;
    while(x<10){
        t = performance.now();
        if(x<4){
            yield; // 条件合致しないときは 止まらない。
        }
        console.log(x);
        tArr.push(t-tPrev);
        tPrev = t;
        x+=1;
    }
}

const f = g();
for(;;){
    const rslt = f.next();
    if(rslt.done){
        break;
    }
    await sleep(1000);

}
console.log(tArr);