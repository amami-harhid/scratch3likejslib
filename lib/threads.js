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
    get THROW_FORCE_STOP_THIS_SCRIPTS(){
        return "throwForceStopThisScripts";
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
    stopOtherScripts(entity){
        const me = this;
        for(const obj of this.threadArr){
            // console.log(`thread name = ${obj.entity.threadName}`);
            // console.log(`StopThisScriptSwitch = ${obj.entity.getStopThisScriptSwitch()}`)
            if(obj.entity.id == entity.id && obj.threadId != entity.threadId){
                // console.log(obj.entity);
                // console.log('※ stopOtherScripts In Threads, thread name='+obj.entity.threadName);
                // stopSwitchON で 例外を誘発する
                obj.entity.setStopThisScriptSwitch(true);
                // console.log(`StopThisScriptSwitch = ${obj.entity.getStopThisScriptSwitch()}`)
                // 「終わるまで音を鳴らす」に対して、強制停止を行う(例外を起こす)
                obj.entity.emit(obj.entity.SOUND_FORCE_STOP);
                // // 他のスクリプトを止めるために、obj.f を入れ替える
                // // 再実行時に例外を起こすようにしている。
                // const f = async function*(){
                //     console.log(`error thread id = ${entity.threadId}, throw = ${me.THROW_STOP_THIS_SCRIPTS}`);
                //     me.THROW_FORCE_STOP_THIS_SCRIPTS();
                // }
                // obj.f = f();
                // console.log(`me.STOP=${me.STOP}`);
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
                            if(_obj.entity.getStopThisScriptSwitch() === true) {
                                _obj.status = me.STOP;
                            }
                            // waitするメソッドがあるときは
                        }).catch(e=>{
                            if(e==me.THROW_STOP_THIS_SCRIPTS){
                                // 何もしない
                                // console.log('[01] me.STOP='+me.STOP);
                                // console.log('name= '+ _obj.entity.threadName);
                                // console.log(e);
                                _obj.forceExit = true;
                                _obj.status = me.STOP;
                                // 「終わるまで音を鳴らす」に対して、強制停止を行う(例外を起こす)
                                _obj.entity.emit(_obj.entity.SOUND_FORCE_STOP);
                            }else if(e==me.THROW_FORCE_STOP_THIS_SCRIPTS){
                               // 何もしない
                                // console.log('[02]');
                                // console.log('name= '+ _obj.entity.threadName);
                                // console.log(e);
                                _obj.forceExit = true;
                                obj.forceExit = true;
                                _obj.status = me.STOP;
                            }else{
                                const f= _obj.originalF;
                                console.error(e);
                                if(f){
                                    console.error(f.toString());
                                }
                                _obj.forceExit = true;
                                throw e;    
                            }
                        }); 
    
                    }catch(e){
                        // この分岐はいらない！
                        if(e==me.THROW_FORCE_STOP_THIS_SCRIPTS){
                            // 何もしない
                            // console.log('[03]');
                            // console.log(e);
                        }else{
                            const f= _obj.originalF;
                            if(f){
                                console.error(f.toString())
                            }
                            _obj.forceExit = true;
                            throw e;    
                        }        
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