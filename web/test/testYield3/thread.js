import {GenericPool} from './genericPool.js'
import {sleep} from './sleep.js'
export class Thread {
    static BREAK = "Error: break";
    static CONTINUE = "Error: continue";
    static break() {
        throw new Error('break');
    }
    static continue() {
        throw new Error('continue');
    }
    constructor(){
        this.gPool = new GenericPool();
    }
    async stop() {
        this.gPool.stop();
    }
    async while( condition, f ) {
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        let _total = 0;
        let count = 0;
        const _g = async function* () {
            const s = performance.now();
            while(_condition()){
                try{
                    // ここは必ずawaitを入れること
                    await f();
                    yield;
                }catch(e){
                    if(e.toString() == Thread.BREAK){
                        break;
                    }else if(e.toString() == Thread.CONTINUE){
                        continue;
                    }else{
                        throw e;
                    }
                }
                count += 1;
            }
            _total = performance.now()-s;
            //throw new Error('LOOP_EXIT');
        }
        try{
            const obj = {f:_g(), g:_g, emitId:"TEST" ,done:false};
            this.gPool.on(obj.emitId, ()=>{
                console.log("on "+ obj.emitId)
                throw "LOOP_EXIT";
            });
            const exitCondition = async _=>{
                return obj.done;
            }
            this.gPool.register(obj);
/*
            for(;;){
                await sleep(100);
            }
*/
            const s = performance.now();
            const _exitCounter = await this.gPool.wait(exitCondition, 0);
            console.log(`------ total=${_total}, count=${count}, average=${_total/count}`)
            const total = performance.now()-s;
            const dif = total - _total;
            console.log(`[${arguments[2]}] END exitCounter=${_exitCounter}, time=${total}, dif=${dif}, difAverage=${dif/_exitCounter}`)
    
        }catch(e){
            console.log("catch :: "+ e.toString());
            if(e.toString() == "LOOP_EXIT"){
                return;
            }
            throw new Error(e);
        }
    
    }



}