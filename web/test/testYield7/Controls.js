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
        const name = arguments[2];
        const currentObj = threads.nowExecutingObj;
        currentObj.enableExecute = false;
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const obj = {f:null, done:false, enableExecute:true, visualFlag: true, parentObj: currentObj};
        obj.name = name;
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
                }
                if(obj.visualFlag){
                    // yield; // 描画に関係する処理があるとき yieldして停止する。
                }
                // Motions があってもなくてもyieldさせている
                // 今の仕組みでは yieldがないと TOP WHILE の2回目で停止してしまう。
                // Motions がないときでも1000/33で停止させるようにする（ここはScratch3と異なる）
                yield;
            }
        }
        try{
            obj.f = _g();
            threads.registThread( obj );
            for(;;){
                if(obj.done) {
//                    currentObj.enableExecute = true;
                    break;
                }
                await sleep(0.1);
            }
        }catch(e){
            if(e.toString() == "LOOP_EXIT"){
                return;
            }
            throw new Error(e);
        }
    
    }


};
export {Loop}