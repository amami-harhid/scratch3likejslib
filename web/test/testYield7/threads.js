const INTERVAL = 1000/33;
class Threads {

    static instance = null;
    static getInstance(){
        if(Threads.instance==null){
            Threads.instance = new Threads();
        }
        return Threads.instance;
    }
    constructor(){
        this.stopper = false;
        this.threadArr = [];
        this.nowExecutingObj = null;
    }
    registThread( _thread ){
        this.threadArr.push(_thread);
    }
    stopAll(){
        this.stopper = true;
    }
    startAll() {
        this._intervalId = setInterval(this.interval, INTERVAL, this);
    }
    async interval(self) {
        for(const obj of self.threadArr){
            // 実行抑止されていないとき
            if(obj.enableExecute){
                self.nowExecutingObj = obj;
                // 投げっぱなしではない await にする                
                const rslt = await obj.f.next();
                if(rslt.done){
                    if(obj.parentObj != null){
                        // 終了したら親の実行停止を解除する。
                        obj.parentObj.enableExecute = true;
                    }
                }
                obj.done = rslt.done;
            }
        }
        // 終了したOBJは削除する
        const _arr = [];
        for(const obj of self.threadArr){
            if(!obj.done) {                
                _arr.push(obj);
            }
        }
        self.threadArr = [..._arr];
    }
}
const threads = Threads.getInstance();

export {threads}