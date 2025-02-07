import {sleep} from './sleep.js';

/*
    n の数が大きくなる（sleepを何度も繰り返す)と、
    1 回の実行の時間が大きくなっていく。なぜなのか？
    sleep関数の中では setTimeout を使っている
    4回以上連続して使うと 急激に遅延が発生する。
    ということは、値変化を監視するためにループ（sleep付き)はまずそう。
    別のところで setTimeout を多用しているので。

*/

// sleep(0) をn回繰り返す
export async function sleepRepeatTest(n){
    const arr = [];
    let counter = 0;
    const s = performance.now();
    for(;;){
        if(counter<n){
            counter+=1;
            await sleep(0);
        }else{
            break;
        }
        arr.push(performance.now())
    }
    const t = performance.now()-s;
    console.log(`sleep 0 x ${counter} total=${t} sleep average=${t/counter} `);
    const arrDiff = [];
    for(let i=0; i<arr.length-1; i++){
        arrDiff.push(arr[i+1]-arr[i]);
    }
    console.log(arrDiff);
}