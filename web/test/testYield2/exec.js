import {clock} from './clock.js'

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
    while( condition, f ) {
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const _g = function* () {
            while(_condition()){
                try{
                    f();
                }catch(e){
                    //console.log(e);
                    if(e.toString() == 'Error: break'){
                        break;
                    }
                    if(e.toString() == 'Error: continue'){
                        continue;
                    }
                }
                console.log('after f(), in exec.while')
                yield; 
            }
        }
        clock.register(_g);
    }

}