import {threads} from './threads.js';
import {sleep} from './sleep.js';
/** 
 * Hats ごとに generatorを格納するオブジェクト を作る
 * オブジェクト要素(childObj)は、generator内で作られる 
 * 子のgeneratorを格納するオブジェクトを格納する。
*/
export class Hats {
    static generator(){
        const src = 'const _f = func; return async function*(){await _f();}';
        const f = new Function(['func'],src);
        return f;
    }
    static async whenWindow(func){
        document.addEventListener('click', async (e)=>{
            e.stopPropagation();
            const obj = threads.createObj();
            const gen2 = Hats.generator()
            const gen = async function*(){
                await func();
            }
            console.log('gen2='+gen2);
            const g3 = gen2(func);
            obj.f = g3();
            console.log(obj.f)
            threads.registThread( obj );
        },false);
    }
    static async whenFlag (func){
        P.flag.addEventListener('click', async (e)=>{
            e.stopPropagation();
            const obj = threads.createObj();
            const gen = async function*(){
                await func();
            }
            obj.f = gen();
            threads.registThread( obj );
        });
    }
    static whenRightNow( func ) {
        setTimeout(_=>{
            const obj = threads.createObj();
            const gen = async function*(){
                await func();
            }
            obj.f = gen();
            threads.registThread( obj );    
        },0);
    }

}