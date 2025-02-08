import {threads} from './threads.js';
/** 
 * Hats ごとに MainThread を作る
 * MainThreadの中で、繰り返し用のSubThreadを作りMainThreadに追加する
 * SubThreadは終われば消去する。
 * 繰り返しの中に繰り返しがあれば、対応するThreadを作り、SubThreadに追加する
 * 
*/
export class Hats {
    static async whenFlag (func){
        // 仮にdocument click としておく
        document.addEventListener('click', async _=>{
            console.log('click')
            const obj = {f:null, done:false, enableExecute:true, parentObj: null};
            obj.name = "HAT";
            const gen = async function*(){
                obj.enableExecute = false;
                await func();
                obj.enableExecute = true;
            }
            obj.f = gen();
            //thread.register(obj);
            threads.registThread( obj );
        });

    }

}