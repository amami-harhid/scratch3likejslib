const Utils = require('./utils');
const threads  = require('./threads');

const Loop = class{
    static get BREAK() {
        return "break";
    }
    static get CONTINUE () {
        return "continue";
    }
    static break(){
        throw Loop.BREAK;
    }
    static continue(){
        throw Loop.CONTINUE;
    }
    static _threadIdCheck(threadId){
        // 自身のid をもつスレッドOBJを取り出す。
        const topObj = threads.getTopThreadObj(threadId);
        if(topObj == null){
            const err = "NOT FOUND OWN GROUP THREAD";
            throw err;
        }
        if(topObj.threadId != threadId) {
            throw "ERROR TOP OBJ"
        }
        const lastChildObj = threads.getLastChildObj(topObj);
        if(lastChildObj.threadId != threadId) {
            throw "ERROR Child OBJ"
        }
        return lastChildObj;
    }
    static async repeatUntil( condition, func, me ){
        if(me.isProxyTest == undefined){
            throw "REPEAT UNTIL : OBJECT IS NOT PROXY"
        }
        const threadId = me.threadId; // me はproxyインスタンス
        // 自身のid をもつスレッドOBJを取り出す。
        const topObj = threads.getTopThreadObj(threadId);
        if(topObj == null){
            //console.log(threadId)
            const err = "NOT FOUND OWN GROUP THREAD";
            throw err;
        }
        if(topObj.threadId != threadId) {
            throw "ERROR TOP OBJ"
        }
        const lastChildObj = threads.getLastChildObj(topObj);
        if(lastChildObj.threadId != threadId) {
            throw "ERROR Child OBJ"
        }
        //const parentObj = threads.nowExecutingObj; // 現在実行中のOBJを取り出す。
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const obj = threads.createObj();//{f:null, done:false, visualFlag: true, childObj: null};
        obj.threadId = threadId;
        obj.entityId = me.id;
        // condition成立しないときはループしない。
        const src = 
        `const _f = func; 
        return async function*(){ 
            while( !condition() && !obj.forceExit){
                obj.status = threads.RUNNING;
                try{
                    await _f(entity); //ここはかならずawait
                    obj.status = threads.YIELD;
                    yield;
                }catch(e){
                    if(e.toString() == Loop.BREAK){
                        break;
                    }else if(e.toString() == Loop.CONTINUE){
                        continue;
                        yield;
                    }else{
                        throw e;
                    }
                }finally{                
                }
            }
            if(obj.forceExit){
                // 音がなっているときは止める。
                entity.soundStopImmediately();
            }
        }
        `;
        const f = new Function(['threads', 'obj', 'condition', 'entity', 'Loop', 'func'], src);
        const gen = f(threads, obj, _condition, me, Loop, func.bind(me));
        obj.f = gen();
        obj.originalF = func;
        //obj.entityId = me.id;
        //threads.registThread( obj );
        obj.parentObj = lastChildObj; // 親を設定
        lastChildObj.childObj = obj;  // 子を設定

        // 終わるまで待つ。
        for(;;){
            if(obj.done) {
                lastChildObj.childObj = null; // 親から子を削除
                break;
            }
            await Utils.wait(0.1);
        }
    }
    static async repeat( count, func, me ){
        const threadId = me.threadId; // me はproxyインスタンス
        const lastChildObj = Loop._threadIdCheck(threadId);
        const obj = threads.createObj();//{f:null, done:false, visualFlag: true, childObj: null};
        obj.threadId = threadId;
        obj.entityId = me.id;
        const src = 
        `const _f = func; 
        return async function*(){ 
            for(let i=0; i<count; i++){
                // 停止する
                if(obj.forceExit == true){
                    // 音がなっているときは止める。
                    entity.soundStopImmediately();
                    break;
                }
                obj.status = threads.RUNNING;
                try{
                    await _f(entity); //ここはかならずawait
                    obj.status = threads.YIELD;
                    yield;
                }catch(e){
                    if(e.toString() == Loop.BREAK){
                        break;
                    }else if(e.toString() == Loop.CONTINUE){
                        continue;
                        yield;
                    }else{
                        throw e;
                    }
                }finally{                
                }
            }
        }
        `;
        const f = new Function(['threads', 'obj', 'count', 'entity', 'Loop', 'func'], src);
        const gen = f(threads, obj, count, me, Loop, func.bind(me));
        obj.f = gen();
        obj.originalF = func;
        //obj.entityId = me.id;
        //threads.registThread( obj );
        obj.parentObj = lastChildObj; // 親を設定
        lastChildObj.childObj = obj;  // 子を設定
        // 終わるまで待つ。
        for(;;){
            if(obj.done) {
                lastChildObj.childObj = null; // 親から子を削除
                break;
            }
            await Utils.wait(0.1);
        }

    }
    static async while( condition, func , me) {
        if(me.isProxyTest == undefined){
            console.log('---- Control#while -----')
            console.log(me);
            throw "OBJECT IS NOT PROXY"
        }
        const threadId = me.threadId; // me はproxyインスタンス
        // 自身のid をもつスレッドOBJを取り出す。
        const topObj = threads.getTopThreadObj(threadId);
        if(topObj == null){
            //console.log(threadId)
            const err = "NOT FOUND OWN GROUP THREAD";
            throw err;
        }
        if(topObj.threadId != threadId) {
            throw "ERROR TOP OBJ"
        }
        const lastChildObj = threads.getLastChildObj(topObj);
        if(lastChildObj.threadId != threadId) {
            throw "ERROR Child OBJ"
        }
        //const parentObj = threads.nowExecutingObj; // 現在実行中のOBJを取り出す。
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const obj = threads.createObj();//{f:null, done:false, visualFlag: true, childObj: null};
        obj.threadId = threadId;
        obj.entityId = me.id;
        const src = 
        `const _f = func; 
        return async function*(){ 
            while(condition() && !obj.forceExit){
                obj.status = threads.RUNNING;
                try{
                    await _f(entity); //ここはかならずawait
                    obj.status = threads.YIELD;
                    yield;
                }catch(e){
                    if(e.toString() == Loop.BREAK){
                        break;
                    }else if(e.toString() == Loop.CONTINUE){
                        continue;
                        yield;
                    }else{
                        throw e;
                    }
                }finally{                
                }
            }
            if(obj.forceExit){
                // 音がなっているときは止める。
                entity.soundStopImmediately();
            }
        }
        `;
        const f = new Function(['threads', 'obj', 'condition', 'entity', 'Loop', 'func'], src);
        const gen = f(threads, obj, _condition, me, Loop, func.bind(me));
        obj.f = gen();
        obj.originalF = func;
        //obj.entityId = me.id;
        //threads.registThread( obj );
        obj.parentObj = lastChildObj; // 親を設定
        lastChildObj.childObj = obj;  // 子を設定

        // 終わるまで待つ。
        for(;;){
            if(obj.done) {
                lastChildObj.childObj = null; // 親から子を削除
                break;
            }
            await Utils.wait(0.1);
        }
    }
};
const Controls = class {

    static async waitSeconds( _seconds  ) {
        await Utils.wait( _seconds * 1000 );
    }

    static async waitUntil( _condition , _pace = 1000/30) {
        const condition = (typeof _condition == 'function')? _condition: ()=>_condition;
        for(;;) {
            if(condition() === true) break;
            await Utils.wait(_pace);
        }
    }
    static async waitWhile( _condition , _pace = 1000/30) {
        const condition = (typeof _condition == 'function')? _condition: ()=>_condition;
        for(;;) {
            if(condition() !== true) break;
            await Utils.wait(_pace);
        }
    }

};

module.exports = {"Controls":Controls, "Loop": Loop};
