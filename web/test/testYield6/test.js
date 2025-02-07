/*
   g=async function*() { yield;yield;yield; } のときの
   f=g() ,  f.next() のとき どのyieldで止まるか？ 
*/
import {sleep} from './sleep.js';
let arr = [];

window.onload = async ()=>{
    for(;;){
        break;
        //const s = Date.now();
        if(arr.length>0){
            const obj = arr[arr.length-1];
            const f = obj.f;
            //const s = Date.now();
            const rslt = await f.next();
            //console.log(`${Date.now()-s}`); //---> 0 がほとんど。1 が一部。
            if(rslt.done){
                //console.log('DONE DONE DONE')
                obj.done = rslt.done;
                arr = arr.splice(0, arr.length-1);
            }
        }
        //const t = Date.now() - s;
        //console.log(`t=${t}`);
        await sleep(1000/30-2);
    }
}

const whileGenerator = async (condition, f)=>{
    console.log('whileGenerator')
    const g = async function*(){
        while(condition()){
            await f();
//            console.log('step01');
//            yield;
//            console.log('step02');
//            yield;
//            console.log('step03');
            yield;
        }
    }
    const obj = {f:g(), done:false};
    //arr.push(obj);
    let exitCounter = 0;
    const exitCondition = async _=>{
        exitCounter += 1;
        const rslt = await obj.f.next();
        return rslt.done;
    }
    await wait(exitCondition, 1000/33);
    console.log('END'+'exitCounter='+exitCounter)
}
const wait = async(condition, intervalMs=1)=>{
    return new Promise(async (resolve)=>{
        if(await condition()){
            resolve();
        }
        const intervalId = setInterval(async ()=>{
            if(await condition()){
                clearInterval(intervalId);
                resolve();
            }
        },intervalMs);
    });
}
const waitAsync = async function(condition, intervalMs=1) {

    if(condition()) {
        return;
    }

    const intervalId = setInterval(()=>{
        if(condition()){
            clearInterval(intervalId);
        }
    }, intervalMs);
} 

const buttonTEST = document.getElementById('buttonTEST');
buttonTEST.addEventListener('click',async ()=>{
    let x=0;
    let count =0;
    const s = Date.now();
    await whileGenerator(_=>x<10, _=>{
        //console.log(`[1] while x=${x}`);
        x+=1;
        count+=1;
    });
    const t = Date.now() - s;
    console.log('count='+count);
    console.log(`TotalTime=${t}, UnitTime=${t/count}`)

});