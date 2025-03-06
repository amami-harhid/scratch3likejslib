import {Event} from './event.js'
import {sleep} from './sleep.js';


const INTERVAL = 1000/30;

const threadsArr = [];

const interval = setInterval(()=>{

    for(const thread of threadsArr) {
        console.log(thread.status)
        if(thread.status==="YIELD"&&thread.done === false){
            thread.status="RUNNING";
            thread.f.next().then(rtn=>{
                thread.done = rtn.done;
                if(thread.done === false){
                    thread.status = "YIELD";
                }
            });
        }
    }

},INTERVAL);
document.getElementById('btn').addEventListener("click",()=>{
    let count = 0;
    const condition = ()=>count<100;
    const f = ()=>{
        count += 1;
        console.log(`#count=${count}`);
    }
    threadsArr.push({f:func(condition,f),done:false,status:"YIELD"});
});
const func = async function*(condition, f) {
    let count = 0;
    const start = performance.now();
    let _s = 0;
    while(condition()){
        _s = performance.now();
        f();        
        count += 1;
        await sleep(30);
        console.log(`tick = ${performance.now()-_s}`);
        yield;
    }
    console.log(`tick average=${(performance.now()-start)/count}`)
    threadsArr.splice(0);
}


