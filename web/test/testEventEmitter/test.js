/*
   EventEmitterにより 33ms ごとに処理を起動する方式をテストする
   while(x<10) のとき 1回あたりの時間= 約33ms
   回数が増える都度、 1回あたりの時間は増えていく傾向あり ( 1000回繰り返しの1回あたりは 36 ms )
*/
import {sleep} from './sleep.js'
const eventEmitter = new P.EventEmitter();
const Exec = class extends P.EventEmitter {

    constructor(){
        super();
        this.waitRelease = false;
        this.waitTimeArr = []
    }

    async wait() {
        const s = Date.now();
        while(true){
            if( this.waitRelease ) {
                this.waitRelease = false;
                break;
            }
            await sleep(1); 
        }
        this.waitTimeArr.push(Date.now()-s);
        //console.log('waitRelease')
    }

    async while(condition, f ){
        const _this = this;
        const emitNext = _=> {
            //console.log('emit next')
            _this.waitRelease = true;
        }
        _this.on('next', emitNext);
        const s = Date.now();
        while(condition()){

            await f();

            await this.wait();
        }
        exec.removeListener('next', emitNext);
        const e = Date.now();
        console.log((e-s)/10)
        console.log(this.waitTimeArr);

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
    console.log('while start')
    let x = 0;
    await exec.while(_=>x<10, _=>{

        x+= 1;
        //console.log('while x='+x);
    })

});
const buttonStop = document.getElementById('buttonStop')
buttonStop.addEventListener('click', _=>{

    stopper = true;
    console.log('stop')

});


