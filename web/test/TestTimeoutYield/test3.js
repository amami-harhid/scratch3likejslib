import {sleep} from './sleep.js';

/*
    setTimeout  INTERVAL=1000/33

*/
const INTERVAL = 1000/33;
let count = 0;
let ss = 0;
// sleep(0) をn回繰り返す
export async function sleepRepeatTest(n){
    console.log('-----------------')
    ss = performance.now();
    setTimeout(step, INTERVAL, n);
}

const step = (n)=>{
    const t = performance.now() - ss
    console.log(`[${n}, count=${count}, t=${t}]`)
    count+=1;
    if(count<n){
        ss = performance.now();
        setTimeout(step, INTERVAL, n);
        return;
    }

}