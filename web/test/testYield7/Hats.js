import {threads} from './threads.js';
import {sleep} from './sleep.js';
/** 
 * Hats ごとに generatorを格納するオブジェクト を作る
 * オブジェクト要素(childObj)は、generator内で作られる 
 * 子のgeneratorを格納するオブジェクトを格納する。
*/
export class Hats {
    static createObj(){
        return {f:null, done:false, childObj: null};
    }
    static async whenWindow(func){
        document.addEventListener('click', async (e)=>{
            e.stopPropagation();
            const obj = Hats.createObj();
            const gen = async function*(){
                await func();
            }
            obj.f = gen();
            threads.registThread( obj );
        },false);
    }
    static async whenFlag (func){
        P.flag.addEventListener('click', async (e)=>{
            e.stopPropagation();
            const obj = Hats.createObj();
            const gen = async function*(){
                await func();
            }
            obj.f = gen();
            threads.registThread( obj );
        });

    }

}