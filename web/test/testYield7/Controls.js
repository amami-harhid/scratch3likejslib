import {threads} from './threads.js';
import {sleep} from './sleep.js';

const Loop = class{
    static BREAK = "break";
    static CONTINUE = "continue";
    static break(){
        throw Loop.BREAK;
    }
    static continue(){
        throw Loop.CONTINUE;
    }
    static async repeat( count, f ){

    }
    static async while( condition, f ) {
        const currentObj = threads.nowExecutingObj;
//        currentObj.enableExecute = false;
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
//        const obj = {f:null, done:false, enableExecute:true, visualFlag: true, childObj: null};
        const obj = {f:null, done:false, visualFlag: true, childObj: null};
        currentObj.childObj = obj;
        const _g = async function* () {
            //const s = performance.now();
            obj.visualFlag = false;
            while(_condition()){
                try{
                    // ここは必ずawaitを入れること
                    await f();
                }catch(e){
                    if(e.toString() == Loop.BREAK){
                        break;
                    }else if(e.toString() == Loop.CONTINUE){
                        continue;
                    }else{
                        throw e;
                    }
                }finally{
                    // Motions があってもなくてもyieldさせている
                    // 今の仕組みでは二重ループのときに yieldがないと TOP WHILE の2回目で停止してしまう。
                    // Motions がないときでも1000/33で停止させるようにする（ここはScratch3と異なる）
                    //if(obj.visualFlag)
                    yield;
                }
            }
        }

        obj.f = _g();
        //threads.registThread( obj );
        // 終わるまで待つ。
        for(;;){
            if(obj.done) {
                currentObj.childObj = null;
                break;
            }
            await sleep(0.1);
        }

    }


};
export {Loop}