import {clock} from './clock.js'
import {sleep} from './sleep.js'
export class Exec {

    async stop() {
        clock.stop();
    }
    static break() {
        throw new Error('break');
    }
    static continue() {
        throw new Error('continue');
    }
    async while( condition, f ) {
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const _g = async function* () {
            while(_condition()){
                try{
                    // ここは必ずawaitを入れること
                    await f();
                    yield;
                }catch(e){
                    //console.log(e);
                    if(e.toString() == 'Error: break'){
                        //console.log('----breaked----')
                        break;
                    }else if(e.toString() == 'Error: continue'){
                        //console.log('----continued----')
                        continue;
                    }
                }finally{
                }
                //console.log('after f(), in exec.while')
            }
        }
        await clock.exec(_g);
    }


}