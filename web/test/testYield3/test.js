import {Thread} from './thread.js'
import {sleep} from './sleep.js'
// Execのインスタンスは スレッド単位に作成する前提
// 発展形：
// ・ Threadインスタンスを生成する都度、
//    ThreadAllインスタンス(シングルトン) 内の配列へpush()する
//    ThreadAll側で配列を調べて、exec()する。みたいな形にしたい

const thread = new Thread();
let x=0;
await sleep(1000);
/*
console.log(`【0】`);
await thread.while( _=>x<5 , async _=>{
    console.log(`【0】while ===== x=${x}`);
    x += 1;
    //xx += 1;
},"--");
*/
await sleep(500);

//【2】 xx < 5 の間 ループする
let xx = 0;
let count = 0;
const s = performance.now();
await thread.while( _=> xx<1 , async _=>{
    //console.log(`【1】while ===== xx=${xx}`);
/*
    let xy = 0;
    await thread.while(_=>xy<5  ,  async _=>{
        console.log(`【2】while ===== xx=${xx}, xy=${xy}`);
        let xz = 0;
        await thread.while(_=>xz<2, async _=>{
            console.log(`【3】while ===== xx=${xx}, xy=${xy}, xz=${xz}`);
            xz += 1;
            count +=1;
        },"03");
        xy += 1;
        count +=1;
    },"02");
*/
    xx+=1;
    count +=1;
},"01");
const totalTime = performance.now()-s;
thread.stop();
console.log(`Total Time=${totalTime}, count=${count}`)
console.log(`LoopUnit Time=${totalTime/count}`)
console.log('End of Test')




