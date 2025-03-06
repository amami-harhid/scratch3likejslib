import {sleep} from './sleep.js'; 
export class Event extends EventEmitter {

    consturctor() {
        this.super();
    }

    kick() {
        this.emit('KICK');
    }
    async while(condition, f) {
        let count = 0;
        const _start = Date.now();
        const _arr = [];
        while(condition()) {
            const start = Date.now();
            f(); // 1回目の起動は時間かかっているみたい。最初の呼び出しコスト
            count+=1;
            await this.yield(start);
            _arr.push(Date.now()-start);
        }
        if(count>0) {
            const time = Date.now() - _start;
            const oneLoopTime = time/count;
            console.log(`time=${time}, count=${count}`);
            console.log(`time=${oneLoopTime}`);
        }else{
            console.log(`time=0`)
        }
        let sum = 0;
        for(let i=3; i< _arr.length; i++){
            sum += _arr[i];
        }
        console.log(`hosei one time = ${sum/(_arr.length-4)}`);
    }
    get max() {
        return 31;
    }
    async yield(start) {
        const me = this;
        return new Promise(async resolve=>{
            const nextClock = start + me.max;
            const currTime = Date.now()-start;
            const f = function(){
                //console.log(' recieve KICK ')
                resolve();
            }
            if(nextClock>currTime){
                me.once('KICK', f);
//                resolve();
            }else{
                const _sleepTime = 0;
                console.log(_sleepTime);
                await sleep(_sleepTime);
                resolve();
            }
        })
    }
}