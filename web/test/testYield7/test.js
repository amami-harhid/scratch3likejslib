import {threads} from './threads.js';
import {setting} from './process/setting.js';
// Execのインスタンスは スレッド単位に作成する前提
// 発展形：
// ・ Threadインスタンスを生成する都度、
//    ThreadAllインスタンス(シングルトン) 内の配列へpush()する
//    ThreadAll側で配列を調べて、exec()する。みたいな形にしたい
// ３重WHILEで、１回の繰り返し、平均で 33 ～ 55 ms 程度で変動する。
// Scratch3でも同じなのでこれでよいと思う。
// TODO: 2025/2/8 18:30 1ループ平均が 20ms になっている。速すぎるが原因を追及すること！
// ===> continue のとき Controls.while() では yield が通らない。改修済。

window.onload = async _=>{
    console.log('onload')
    await P.init();
    threads.startAll();
};

P.setting = () => {
    setting();
}

