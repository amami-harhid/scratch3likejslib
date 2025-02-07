/*
    精密なsetTimeout の実験
    time が 33ms
    繰り返していくと誤差が生じるが誤差の分だけ 次の間隔を調整する方式
    ほぼ FPS(30)=(1000/30)ms 間隔を実現できている。
    
    これで WHILE(yield)をテストしてみる。

*/
import {sleepRepeatTest} from './test2.js'

//await sleepRepeatTest(1);
//await sleepRepeatTest(2);
//await sleepRepeatTest(3);
//await sleepRepeatTest(4);
//await sleepRepeatTest(5);
//await sleepRepeatTest(10);
//await sleepRepeatTest(20);
//await sleepRepeatTest(30);
//await sleepRepeatTest(40);
//await sleepRepeatTest(50);
await sleepRepeatTest(100);
//await sleepRepeatTest(500);

import {sleep} from './sleep.js';
const INTERVAL = 1000/30;

const Thread = class{
    constructor(){
        this.STOP = false;
        this.fArr = [];
        this.intervalArr = [];
        this.dtArr = [];
        this.measureArr = []
        this.expected = null;
    }
    timerStop(){
        this.STOP = true;
        console.log(`this.STOP=${this.STOP}`)
    }
    timerKick(){
        this.expected = performance.now() + INTERVAL;
        setTimeout(this.step, 0, this);
        this.counter = 0;
    }
    async step(_this) {
        if( _this.STOP ){
            return;
        }
        // 開始遅延した時間を計測
        let dt = performance.now() - _this.expected;
        if(_this.fArr.length>0){
            const obj = _this.fArr[_this.fArr.length-1];
            const rslt = await obj.f.next(); // ほとんど時間はかからない。
            if(rslt.done){
                obj.done = true;
                _this.fArr.pop(); // そんなに時間かからなそう。
            }    
        }
        _this.expected += INTERVAL;
        // 開始遅延した分 次の開始間隔を短くする
        // 遅延がない場合（マイナス値）,開始間隔を長くする
        const interval = Math.max( 0, INTERVAL -dt );
        
        //_this.intervalArr.push(interval);
        //_this.dtArr.push(dt);
        if(_this.fArr.length>0){
            //performance.measure("timeNext", "beforNext", "afterNext");
            //_this.measureArr.push(performance.getEntriesByType("measure"))
        }else{
            //_this.measureArr.push(0)
        }
        _this.counter += 1;
        setTimeout(_this.step, interval, _this);
    }
    async repeat(condition, f){
        console.log(`####[0] ${performance.now()}`)
        const g = async function*(){
            let count = 0;
            const s = performance.now();
            while(condition()){
                console.log(`####[1] ${performance.now()}`)
                await f();
                count += 1;
                yield;
                console.log(`####[1-1] ${performance.now()}`)
            }
            const t = performance.now()-s;
            console.log(`[2] total=${t}, count=${count}, unit=${t/count}`);
            console.log(`####[2] ${performance.now()}`)
        }
        // generator定義で 0.1 ms - 0.2 ms
        console.log(`####[4] ${performance.now()}`)
        const fg = g();
        const obj = {f:fg, done:false};
        this.fArr.push(obj);
        // generator生成 0.2 ms
        console.log(`####[5] ${performance.now()}`)
        // ↓  20ms 程度余計な時間がかかる
        const ss = performance.now();
        for(;;){
            if(obj.done) break;
//            await sleep(1000/33/100);
            await sleep(0);
        }
        // [2](3818.80) [6](3823.60) --> (1)diff: 約 5ms
        // [5](3476.10) [6](3823.60) --> (2)diff: 347.5ms
        // --> TIME と同じ 
        // [2] total=332.30 (2) 347.5 --> (3)diff: 約15ms
        // (3)は setTimeoutのコストとは考えにくい。なぜなら[2]が適切な時間だから。
        // よって(3)は done=trueになるのを監視するループで余計に加算されたと推測する。
        console.log(`####[6] ${performance.now()}`)
        console.log(`TIME=${performance.now()-ss}`);
    }

}
const thread = new Thread();

const buttonStart = document.getElementById('buttonStart');
const buttonTEST = document.getElementById('buttonTEST');
const buttonStop = document.getElementById('buttonStop');

buttonStart.addEventListener('click',_=>{
    console.log('buttonStart')
    thread.timerKick();
});

buttonStop.addEventListener('click',_=>{
    console.log('buttonStop')
    thread.timerStop();
});

buttonTEST.addEventListener('click',async _=>{
    let x = 0;
    let s = performance.now();
    await thread.repeat(_=>x<2, async _=>{
        x+=1;
        //console.log(x);
    });
    let t = performance.now()-s;
    console.log(`[1] total=${t}, one loop=${t/x}`)
    // Thread#repeat() の外側は、10ms-20ms 程度、余計な時間がかかっている。
    // 10回ループのとき 繰り返しごとの平均値= 35 ms
    // 100回ループのとき 繰り返しごとの平均値= 33.4 ms ( 1000/30 に近づく )
    // 1000回ループのとき 繰り返しごとの平均値= 33.35 ms ( 1000/30 に近づく )
    // このことより、Thread#repeat()自体でコストがかかり、while文(yield方式)にはコストの問題はない。
});
