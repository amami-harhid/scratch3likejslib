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
    }

    regist( thread ){
        this.pool.push(thread);
    }

    async start() {
        for(;;){
            for(const thread of this.pool){

            }
            await sleep(1000/30);
        }
    }
}