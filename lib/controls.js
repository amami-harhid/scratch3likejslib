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
        const parentObj = threads.nowExecutingObj; // 現在実行中のOBJを取り出す。
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const obj = threads.createObj();//{f:null, done:false, visualFlag: true, childObj: null};
        parentObj.childObj = obj;  // 子を設定
        obj.parentObj = parentObj; // 親を設定
        const src = 
        `const _f = func; 
        return async function*(){ 
            while(condition()){
                obj.status = threads.RUNNING;
                try{
                    await _f(); //ここはかならずawait
                }catch(e){
                    if(e.toString() == Loop.BREAK){
                        break;
                    }else if(e.toString() == Loop.CONTINUE){
                        continue;
                    }else{
                        throw e;
                    }
                }finally{                
                    obj.status = threads.YIELD;
                    yield;
                }
            }
        }
        `;
        const f = new Function(['threads', 'obj', 'condition', 'func'],src);
        const gen = f(threads, obj,_condition,func.bind(me));

        obj.f = gen();
        threads.registThread( obj );

        // 終わるまで待つ。
        for(;;){
            if(obj.done) {
                parentObj.childObj = null; // 親から子を削除
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
