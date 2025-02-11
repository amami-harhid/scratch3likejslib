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
    static async repeat( count, f ){

    }
    static async while( condition, func , me) {
        const entityId = me.id;
        console.log("in Loop while, entityId="+entityId )
        // 自身のid をもつスレッドOBJを取り出す。
        const topObj = threads.getTopThreadObj(entityId);
        if(topObj == null){
            const err = "NOT FOUND OWN GROUP THREAD";
            throw err;
        }
        console.log(me.name);
        console.log("TOPOBJ=====")
        console.log(topObj.entityId, topObj.childObj);
        if(topObj.entityId != entityId) {
            console.log('in Loop while, topObj=')
            console.log(topObj)
            throw "ERROR TOP OBJ"
        }
        const lastChildObj = threads.getLastChildObj(topObj);
        if(lastChildObj.entityId != entityId) {
            // topObj の child に stage のOBJが入っている
            // どこで入ったのか？
            console.log('in Loop while, topObj=')
            console.log(topObj)
            console.log('last child');
            console.log(lastChildObj); // ？？？ StageのthreadObjがかえってきた。
            throw "ERROR Child OBJ"
        }
        //const parentObj = threads.nowExecutingObj; // 現在実行中のOBJを取り出す。
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const obj = threads.createObj();//{f:null, done:false, visualFlag: true, childObj: null};
        obj.entityId = entityId;
        const src = 
        `const _f = func; 
        return async function*(){ 
            while(condition()){
                // 停止する
                if(obj.forceExit == true){
                    // 音がなっているときは止める。
                    entity.soundStopImmediately();
                    break;
                }
                obj.status = threads.RUNNING;
                try{
                    await _f(); //ここはかならずawait
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
        const f = new Function(['threads', 'obj', 'condition', 'entity', 'Loop', 'func'], src);
        const gen = f(threads, obj, _condition, me, Loop, func.bind(me));
        obj.f = gen();
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

    static async waitUntil( _condition , _pace = 33) {
        for(;;) {
            if(_condition === true) break;
            await Utils.wait(_pace);
        }
    }

};

module.exports = {"Controls":Controls, "Loop": Loop};
