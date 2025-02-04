import {GeneratorPool} from './generatorPool.js'
export class Thread {
    static BREAK = "Error: break";
    static CONTINUE = "Error: continue";
    static ACTIVE = "active";
    static DEAD = "dead";
    static break() {
        throw new Error('break');
    }
    static continue() {
        throw new Error('continue');
    }
    constructor(){
        this.gPool = new GeneratorPool();
        this.status = Thread.DEAD;
    }
    waitRelease(){
        this.gPool.waitRelease();
    }
    async stop() {
        this.gPool.stop();
    }
    async while( condition, f ) {
        this.status = Thread.ACTIVE;
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        const _g = async function* () {
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
                    }
                }
            }
        }
        await this.gPool.executor(_g);
    }

    time() {
        return this.gPool.time;

    }


}