import {Event} from './event.js'
import {sleep} from './sleep.js';

const event = new Event();

let i = 0;
const Timer = class {
    constructor(){
        this.preTime = 0;
    }
    get event() {
        return this._event;
    }
    set event(_event) {
        this._event = _event;
    }
    start() {
        this.preTime = Date.now()
        //const next = this.preTime+event.max;
        this.interval();        
    }
    get preTime() {
        return this._preTime;
    }
    set preTime(preTime){
        this._preTime = preTime;
    }
    interval() {
        const me = this; 
        i+=1;
        if(i>100) return;
        if(i>50) this.event.kick();
        setTimeout(()=>{
            console.log(`intervalTime=${Date.now() - me.preTime}`)
            me.preTime = Date.now()
            me.interval( );
        }, event.max - 0.05 );
    }

}

const eventArr = [];

let counter = 0;
for(let i=0; i<1; i++) {
    counter += 1;
    setTimeout(async(_counter)=>{
        let x = 0;
        const start = Date.now();
        const _event = new Event();
        const _timer = new Timer();
        _timer.event = _event;
        eventArr.push(_timer);
        await _event.while(()=>x<10, ()=>{        
            x += 1;
            //console.log(`counter=${x}`);
        });
        console.log(`(${_counter})  time=${(Date.now()-start)/x}`)
    },0, counter);
}

await sleep(500)
for(const e of eventArr) {
    console.log(e);
    e.start();
}
