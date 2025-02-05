import {sleep} from './sleep.js';
export class ThreadsAll {
    static _instace=null;
    static getInstance(){
        if(ThreadsAll._instance == null){
            ThreadsAll._instance = new ThreadsAll();
        }
        return ThreadsAll._instance;
    }
    
    constructor(){
        this.pool = [];
        this.stopper = false;
    }
    stopAll(){
        this.stopper = true;
    }
    regist( thread ){
        this.pool.push(thread);
    }

    async startAll() {
        return;
        const _TIME = 1000/30;
        for(;;){
            for(const thread of this.pool){
                if(this.stopper){
                    thread.stop();
                }else{
                    thread.waitRelease();
                }
            }
            if(this.stopper) break;
            await sleep(_TIME);
        }
    }
}