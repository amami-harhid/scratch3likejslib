//import {sleep} from './sleep.js'
export class GenericPool {
    constructor() {
        this.thread = null;
        this._g_pool = [];
        this._pool = [];
        //this._interval = 1000/30/2;
        //this._intervalTuning = -5;
        this.stopper = false;
        //this.intervalId = setInterval(this.exec, this._interval, this);
        // setTimeout で実現させて intervalを調整したい。
        this._testArr = []
        this._testArr2 = []
        this._loopCounter = 0;
        this._s = performance.now();
        //setTimeout(this.interval, this._interval, this);
        //this._intervalId = setInterval(this.interval, this._interval, this);
    }
    // タスク実行までのタイムロス
    // ループ
    async interval(self){
        self.thread.enableExecute = false;
        self._loopCounter+=1;
        const _now = performance.now()
        try{
            await self.exec(self);
            self.thread.enableExecute = true;
        }catch(e){
            console.log(e);
            if(e.toString()=="TEST"){
                throw e;
            }
            console.log("Error in interval");
            throw e;
        }
    }
    stop(){
        this.stopper = true;
        console.log(`tSize=${this._testArr.length}, t = ${this._testArr}`);
        console.log(`t2Size=${this._testArr2.length}, t2 = ${this._testArr2}`);
        if(this._intervalId){
            clearInterval(this._intervalId);
        }
    }
    async register( obj ) {
        this._pool.push(obj);
    }
    async exec(self) {
        try{
            if(self._pool.length>0){
                // 最後に追加されたGenerator要素を取得
                const _g = self._pool[self._pool.length-1];
                // await で実行！
                const rslt = await _g.f.next();
                if(rslt.done){
                    _g.done = true;
                    // 最後の要素を除去
                    self._pool.pop();
                    //console.log('======BEFORE ID='+_g.emitId);
                    //self.thread.emit(_g.emitId);
                    //console.log('======AFTER');
                }
            }
            return;

        }catch(e){
            console.log('Error in exec')
            console.log("ERROR==>"+ e);
            throw e;
        }

    }
    async wait(condition, intervalMs) {
        let count = 0;
        return new Promise(async (resolve)=>{
            count+=1;
            if(await condition()){
                //console.log(`condition counter =${count}`)
                resolve(count);
            }
            const intervalId = setInterval(async ()=>{
                count+=1;
                if(await condition()){
                    clearInterval(intervalId);
                    //console.log(`condition counter =${count}`)
                    resolve(count);
                }
            },intervalMs);
        });    
    }
}
