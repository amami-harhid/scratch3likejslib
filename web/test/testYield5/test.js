/*
   Thread#while whileの実行が終わるまで待つようにしたい。
*/
import {sleep} from './sleep.js';
const Thread = class {
    constructor(){
        this.fArr = [];
        this.interval = 1000/30;
        this.execStop = false;
    }
    async exec() {
        console.log('exec loop start.')
        for(;;){
            console.log(`this.fArr.length=${this.fArr.length}`)
            if(this.fArr.length>0){
                const obj = this.fArr[this.fArr.length-1];
                console.log(`in exec. obj.f=${obj.f}`)
                const rslt = await obj.f.next();
                console.log(`in exec. await obj.f exit `)
                if(rslt.done){
                    obj.done = rslt.done;
                    this.fArr.pop();
                    console.log('while done')
                    //break;
                }
                if(this.execStop){
                    break;
                }
            }
            await sleep(this.interval);
        }
        console.log('exec loop exit.')
    }

    async while(condition, f) {
        console.log(`Exec.while  ${arguments[2]}`)
        const g = async function*(){
                while(true){
                    if(condition()){
                        await f();
                        yield;
                    }else{
                        break;
                    }
                }
                console.log('========== Generator while break;')
            };
        const obj = {f:g(), done:false};
        this.fArr.push(obj);
        return new Promise(async(resolve)=>{
            for(;;){
                console.log(`Exec.while Promise obj.done=${obj.done}`);
                if(obj.done){
                    console.log(`================ Exec.while Promise obj.done!!!`);
                    break;
                }
                await sleep(10);
            }
            resolve();            
        })
        
    }
}
const buttonStart = document.getElementById('buttonStart');
const buttonTEST = document.getElementById('buttonTEST');
const buttonStop = document.getElementById('buttonStop');
const thread = new Thread();
buttonStart.addEventListener('click', async _=>{
    thread.exec();
    //console.log('Do nothing')
});
buttonTEST.addEventListener('click', async _=>{
    console.log(`buttonTest Start`);
    const s = Date.now();
    let x=0;
    await thread.while(_=>x<10, async _=>{
        console.log(`[while 01] x=${x}`);
        let y=0;
        await thread.while(_=>y<3, async _=>{
            console.log(`    [while 02] x=${x},y=${y}`);
            y+=1;
        },"02");
        x += 1;
    },"01");
    console.log(`time=${(Date.now()-s)/(10*3)}`);
    console.log(`buttonTest End`)
});
buttonStop.addEventListener('click',_=>{
    thread.execStop = true;
})


