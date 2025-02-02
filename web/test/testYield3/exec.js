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
        const _g = async function* () {
            while(_condition()){
                try{
                    yield;
                    f();
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
        clock.register(_g);
    }
    async whileAndWait( condition, f ) {
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const _g = async function* () {
            while(_condition()){
                try{
                    f();
                    yield;
                }catch(e){
                    //console.log(e);
                    if(e.toString() == 'Error: break'){
                        //console.log('----breaked----')
                        break;
                    }else if(e.toString() == 'Error: continue'){
                        //console.log('----continued----')
                        yield;
                        continue;
                    }
                }finally{
                }
                //console.log('after f(), in exec.while')
            }
        }
        console.log("registerAndWait start")
        console.log(f)
        await clock.registerAndWait(_g);
        console.log("registerAndWait end")
    }


}