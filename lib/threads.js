const PlayGround = require('./playGround');
const Utils = require('./utils')
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
    get THROW_STOP_THIS_SCRIPTS(){
        return "throwStopThisScripts";
    } 
    getTopThreadObj(threadId){
        for(const obj of this.threadArr){
            if(obj.threadId == threadId) {
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
        this._intervalId = null;
        this._running = false;
    }
    createObj(){
        return {
            f:null,
            originalF:null,
            done:false, 
            status: this.YIELD,
            forceExit: false,
            threadId: null,
            entityId: null,
            childObj: null, 
            parentObj: null,
            entity: null,
            doubleRunable: true
        };
    }
    registThread( obj ){
        this.threadArr.push( obj );
    }
    async startAll() {
        if(this._intervalId != null) return;
        this._intervalId = setInterval(this.interval, INTERVAL, this);
        this._running = true;
    }
    isNotRunning(){
        return !this._running;
    }
    isRunning(){
        return this._running;
    }
    clearThreads(){
        this.threadArr = [];
    }
    pauseThreadsInterval() {
        if(this._intervalId){
            // 音なっているときは止める。
            const p = PlayGround.default;
            const stage = p.stage;
            if(stage != null){
                stage.$soundStopImmediately();
                stage.$speechStopImmediately();
                if(stage.sprites != null){
                    for(const s of stage.sprites){
                        s.$soundStopImmediately();
                        s.$speechStopImmediately();
                    }    
                }    
            }
            clearInterval(this._intervalId);
            this._intervalId = null;
            this._running = false;
        }

    }
    /**
     * intervalを停止する
     * クローンをremoveする
     * threads はクリアする
     * クローン以外のスプライト、ステージはremoveしない（そのまま）
     */
    stopThreadsInterval(){
        if(this._intervalId){
            clearInterval(this._intervalId);
            this._intervalId = null;
            this.clearThreads();
            // 音なっているときは止める。
            const p = PlayGround.default;
            const stage = p.stage;
            if(stage != null){
                stage.$soundStopImmediately();
                stage.$speechStopImmediately();
                if(stage.sprites != null){
                    for(const s of stage.sprites){
                        if(s){
                            s.$soundStopImmediately();
                            s.$speechStopImmediately();
                        }
                    }    
                }    
            }
        }
        this._running = false;
    }
    stopAll(){
        this.stopper = true;
        this._running = false;
    }
    stopOtherScripts(entity, threadId){
        for(const obj of this.threadArr){
            if(obj.entity.id == entity.id && obj.threadId != threadId){
                obj.forceExit = true;
                obj.entity.$soundStopImmediately();
                obj.entity.$speechStopImmediately();
                obj.entity.$stopThisScriptSwitch = true;
            }
        }
    }
    removeObjById(id, clickCounter){
        if( clickCounter == undefined){
            for(const obj of this.threadArr){
                if(obj.doubleRunable === false && obj.entityId == id){
                    obj.forceExit = true;
                    obj.entity.$soundStopImmediately();
                    obj.entity.$speechStopImmediately();
                }
            }    
        }else{
            for(const obj of this.threadArr){
                if(obj.doubleRunable === false && obj.entityId == id && 
                        obj.entity && obj.entity.threadCounter == clickCounter){
                    obj.forceExit = true;
                    obj.entity.$soundStopImmediately();
                    obj.entity.$speechStopImmediately();
                }
            }    
        }
    }
    async interval(me) {
        const _p = PlayGround.default;
        for(const obj of me.threadArr){
            if(!obj.entity.isAlive()){ // Entity生きていないとき
                obj.forceExit = true; // 強制終了とする
            }
            if(obj.status != me.STOP){
                // obj.childObj が設定済のときは最終OBJを取り出す。
                const _obj = me.getLastChildObj(obj);
                //me.nowExecutingObj = _obj;
                if(_obj.status == me.YIELD){
                    // 投げっぱなし, Promise終了時に done をObjへ設定する
                    //await はつけずにPromise.then で解決する。
                    // 長いBGM演奏などのとき他スレッドが止まるため awaitで止めない。
                    _obj.status = me.RUNNING;
                    try{
                        _obj.f.next().then((rslt)=>{
                            _obj.done = rslt.done;
                            _obj.status = me.YIELD;
                            // waitするメソッドがあるときは
                        }).catch(e=>{
                            if(e==me.THROW_STOP_THIS_SCRIPTS){
                                // 何もしない
                                // console.log('なにもしない');
                            }else{
                                const f= _obj.originalF;
                                console.error(e);
                                if(f){
                                    console.error(f.toString());
                                }
                                throw e;    
                            }
                        }); 
    
                    }catch(e){                        
                        const f= _obj.originalF;
                        if(f){
                            console.error(f.toString())
                        }
                        throw e;
                    }
                }
            }
        }
        // 終了したOBJは削除する
        const _arr = [];
        for(const obj of me.threadArr){
            const lastChildObj = me.getLastChildObj(obj);
            if(!obj.forceExit && ( !obj.done || !lastChildObj.done) ) {                
                _arr.push(obj);
            }
        }
        me.threadArr = [..._arr];
        _p._draw();
    }
}
const threads = Threads.getInstance();
module.exports = threads;