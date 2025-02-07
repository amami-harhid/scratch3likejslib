import {sleep} from './sleep.js'
export class GeneratorPool {
    constructor() {
        this._g_pool = [];
        this._pool = [];
        this._waitRelease = false;
        this.stopper = false;
        this.time = [];
    }
    waitRelease(){
        this._waitRelease = true;
    }
    async wait(waitTime) {
        this.time.push(waitTime);
        const _time = waitTime;//1000/30;
        return new Promise( async (resolve)=>{
            //for(;;){
            //    if(this._waitRelease || this.stopper) {
            //        this._waitRelease = false;
            //        break;
            //    }
            //    await sleep(_time);
            //}
            await sleep(_time);
            resolve();
        });
    }
    stop(){
        this.stopper = true;
    }
    async register( g ) {
        this._g_pool.push(g);
        this._pool.push({ready:true, done:false, f:g(), g:g});
        //console.log(this._pool);
    }
    async executor(g) {
        this.register(g);
        const TIME = 1000/30;
        if(this._pool.length>0){
            // 最後に追加された要素を取得
            const _p = this._pool[this._pool.length-1];
            const start = Date.now();
            const waitTimeArr = []
            const performanceTimeArr = []
            let _start = Date.now();
            for(;;){
                // await で実行！
                const rslt = await _p.f.next();
                if(rslt.done){
                    // 最後の要素を除去
                    this._pool = this._pool.splice(0, this._pool.length-1);
                    break;
                }
                const end = Date.now();
                const performanceTime = end -_start;
                // 0.5 ms 分 wait時間を短くすることで、平均33ms の調整をしている。
                // 
                const _waitTime = (performanceTime>TIME)? 5 : TIME - performanceTime + 5
                performanceTimeArr.push(performanceTime);
                _waitTime = 1000/30;
                waitTimeArr.push(_waitTime)
                //await sleep(_waitTime)
                //console.log(_waitTime)
                this.sleep(_waitTime);
                //await this.wait(_waitTime);
                _start = end;
            }
            const end = Date.now();
            //console.log(`--------${(end-start)/10}`);
            console.log(`--------performanceTimeArr=${performanceTimeArr}`);
            console.log(`--------waitTimeArr=${waitTimeArr}`);

            // 計測結果が 平均値 33ms より離れる。原因追及すること！
        }

    }
    sleep(ms) {
        const start = Date.now();
        while(Date.now()-start < ms) {
            ;; // busy
        }
    }
}
