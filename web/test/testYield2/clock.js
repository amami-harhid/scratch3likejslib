import {sleep} from './sleep.js'
class Clock {
    static instance;
    static async getInstance(){
        if(Clock.instance == undefined){
            const _clock = new Clock();
            Clock.instance = _clock;
            _clock.stopper = false;
            _clock.start();
        }
        return Clock.instance;
    }
    constructor() {
        this._pool = [];
    }
    stop(){
        this.stopper = true;
    }
    async start(){
        for(;;) {
            await this.kick();
            await sleep(1000/30);
            if(this.stopper){
                break;
            }
        }
    }
    register( g ) {
        this._pool.push({ready:true, done:false, f:g(), g:g});
        console.log(this._pool);
    }
    async kick() {
        let allDone = true;
        for(const _p of this._pool) {
            if(_p.done === false){
                let status;
                if(/^async\s/.test(_p.g.toString())){
                    status = await _p.f.next();
                    //console.log('async await')
                }else{
                    status = _p.f.next();
                }
                //console.log(status);
                _p.done = status.done;
                _p.ready = !status.done;
                allDone = allDone && status.done
            }
        }
        const pool = [...this._pool] 
        this._pool.splice(0);
        for(const _p of pool) {
            if( _p.ready ){
                this._pool.push(_p);
            }
        }
        //console.log(this._pool.length)
        return allDone;
    }
}
const clock = await Clock.getInstance();
export  {clock};