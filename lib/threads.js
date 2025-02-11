const Process = require('./process');
const INTERVAL = 1000/33;
class Threads {
    static getInstance(){
        if(!Threads.instance) {
            Threads.instance = new Threads();
        }
        return Threads.instance;
    }
    get RUNNING(){
        return 'running';
    }
    get YIELD(){
        return 'yield';
    }
    get STOP(){
        return 'stop';
    }
    getTopThreadObj(entityId){
        for(const obj of this.threadArr){
            if(obj.entityId == entityId) {
                return obj;
            }
        }
        return null;
    }
    getTopParentObj(obj){
        let _obj = obj.parentObj;
        for(;;){
            if(_obj == null || _obj.parentObj==null) break;
            _obj = _obj.parentObj;
        }
        if(_obj == null)
            return obj;
        else
            return _obj;
    }
    getLastChildObj(obj){
        let _obj = obj.childObj;
        for(;;){
            if(_obj == null || _obj.childObj == null) break;
            _obj = _obj.childObj;
        }
        if(_obj==null){
            _obj = obj;
        }
        return _obj;
    }
    constructor(){
        this.stopper = false;
        this.threadArr = [];
        //this.nowExecutingObj = null;
    }
    createObj(){
        return {
            f:null, 
            done:false, 
            status: this.YIELD,
            forceExit: false,
            entityId: null,
            childObj: null, 
            parentObj: null
        };
    }
    registThread( obj ){
        this.threadArr.push( obj );
    }
    startAll() {
        this._intervalId = setInterval(this.interval, INTERVAL, this);
    }
    stopAll(){
        this.stopper = true;
    }
    removeObjById(id){
        for(const obj of this.threadArr){
            if(obj.entityId == id){
                obj.forceExit = true;
            }
        }
    }
    async interval(me) {
        const _process = Process.default;
        //console.log('Threads interval');
        //console.log(me.threadArr);
        for(const obj of me.threadArr){
            //console.log('Threads interval obj');
            //console.log(obj);
            if(obj.status != me.STOP){
                // obj.childObj が設定済のときは最終OBJを取り出す。
                const _obj = me.getLastChildObj(obj);
                //me.nowExecutingObj = _obj;
                if(_obj.status == me.YIELD){
                    // 投げっぱなし, Promise終了時に done をObjへ設定する
                    _obj.f.next().then((rslt)=>{ //await はずす
                        _obj.done = rslt.done;    
                    }); 
                }
            }
        }
        _process._draw();
        // 終了したOBJは削除する
        const _arr = [];
        for(const obj of me.threadArr){
            const lastChildObj = me.getLastChildObj(obj);
            if(obj.forceExit || !obj.done || !lastChildObj.done) {                
                _arr.push(obj);
            }
        }
        me.threadArr = [..._arr];
    }
}
const threads = Threads.getInstance();
module.exports = threads;