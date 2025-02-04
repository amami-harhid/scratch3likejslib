/*
   EventEmitterにより 33ms ごとに処理を起動する方式をテストする

*/
import {sleep} from './sleep.js'
const eventEmitter = new P.EventEmitter();
const Exec = class extends P.EventEmitter {

    constructor(){
        super();
        this.waitRelease = false;

    }

    async wait() {
        while(true){
            if( this.waitRelease ) {
                this.waitRelease = false;
                break;
            }
            await sleep(1); 
        }
        console.log('waitRelease')
    }

    async while(condition, f ){
        const _this = this;
        _this.on('next', _=>{
            console.log('emit next')
            _this.waitRelease = true;
        })
        const s = Date.now();
        while(condition()){

            await f();

            await this.wait();
        }
        const e = Date.now();
        console.log((e-s)/1000/10)

    }
}
const exec = new Exec();
let stopper = false;
const button01 = document.getElementById('button01');
const button02 = document.getElementById('button02');
button01.addEventListener('click', async (e)=>{
    while(true){
        if(stopper) break;
        exec.emit('next');
        await sleep (1000/30);
    }
    console.log(' while stop ')

});
button02.addEventListener('click', async (e)=>{

    let x = 0;
    await exec.while(_=>x<10, _=>{

        x+= 1;
        console.log('while x='+x);
    })

});
const buttonStop = document.getElementById('buttonStop')
buttonStop.addEventListener('click', _=>{

    stopper = true;
    console.log('stop')

});


