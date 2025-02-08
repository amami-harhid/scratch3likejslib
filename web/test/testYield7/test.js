import {Hats} from './Hats.js';
import {Loop} from './Controls.js';
import {Motions} from './Motions.js';
import {threads} from './threads.js';
// Execのインスタンスは スレッド単位に作成する前提
// 発展形：
// ・ Threadインスタンスを生成する都度、
//    ThreadAllインスタンス(シングルトン) 内の配列へpush()する
//    ThreadAll側で配列を調べて、exec()する。みたいな形にしたい
// ３重WHILEで、１回の繰り返し、平均で 33 ～ 55 ms 程度で変動する。
// Scratch3でも同じなのでこれでよいと思う。
// TODO: 2025/2/8 18:30 1ループ平均が 20ms になっている。速すぎるが原因を追及すること！

window.onload = _=>{
    console.log('onload')
    threads.startAll();
};

// 最後のパラメータ("HAT","01","02")はデバッグ用なので後で消すこと
Hats.whenFlag(async _=>{
    const s = performance.now();
    let count = 0;
    let x=0;
    await Loop.while(_=>x<10, async _=>{
        console.log("top while ======== "+x);
        let y=0;
        await Loop.while(_=>y<10, async _=>{
            y+=1;
            console.log('    subWhile '+y)
            //Motions.move(10);
            count+=1;
            if(y > 5) Loop.continue();
            console.log('    subWhile '+y+' NOT CONTINUE')
        },"02");
        x+=1;
        count+=1;
        console.log('top while _____ last')
    },"01");
    console.log("---END---");
    const time = performance.now()-s;
    console.log(`time=${time}, loop=${time/count}`)
},"HAT");
