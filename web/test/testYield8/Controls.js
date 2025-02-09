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
        const parentObj = threads.nowExecutingObj; // 現在実行中のOBJを取り出す。
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const obj = threads.createObj();//{f:null, done:false, visualFlag: true, childObj: null};
        parentObj.childObj = obj;  // 子を設定
        obj.parentObj = parentObj; // 親を設定
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
                parentObj.childObj = null; // 親から子を削除
                break;
            }
            await sleep(0.1);
        }

    }


};
export {Loop}