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

            // obj.childObj が設定済のときは最終OBJを取り出す。
            let _obj = obj.childObj;
            for(;;){
                if(_obj == null || _obj.childObj == null) break;
                _obj = _obj.childObj;
            }
            if(_obj==null){
                _obj = obj;
            }
            self.nowExecutingObj = _obj;
            // 投げっぱなしではない await にする                
            const rslt = await _obj.f.next();
            _obj.done = rslt.done;
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