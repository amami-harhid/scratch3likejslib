import {Thread} from './thread.js'
import {sleep} from './sleep.js'
// Execのインスタンスは スレッド単位に作成する前提
// 発展形：
// ・ Threadインスタンスを生成する都度、
//    ThreadAllインスタンス(シングルトン) 内の配列へpush()する
//    ThreadAll側で配列を調べて、exec()する。みたいな形にしたい
// ３重WHILEで、１回の繰り返し、平均で 33 ～ 55 ms 程度で変動する。
// Scratch3でも同じなのでこれでよいと思う。
// ビジュアル処理がないとき yieldをしない（その分、処理時間が短い）

const thread = new Thread();

//【2】 xx < 5 の間 ループする
let xx = 0;
let counter = 0;
const s = performance.now();
await thread.while( _=> xx<10 , async _=>{
    console.log(`【1】while ===== xx=${xx}`);
    let xy = 0;
    await thread.while(_=>xy<2  ,  async _=>{
        console.log(`【2】while ===== xx=${xx}, xy=${xy}`);
        let xz = 0;
        await thread.while(_=>xz<1, async _=>{
            console.log(`【3】while ===== xx=${xx}, xy=${xy}, xz=${xz}`);
            await thread.move();
            
            xz += 1;
            counter +=1;
        },"03");
        xy += 1;
        counter +=1;
        await thread.move();
    },"02");

    xx+=1;
    counter +=1;
    await thread.move();

},"01");
const totalTime = performance.now()-s;
thread.stop();
console.log(`Total Time=${totalTime}, Loop Count=${counter}`)
console.log(`LoopUnit Time=${totalTime/counter}`)
console.log('End of Test')





