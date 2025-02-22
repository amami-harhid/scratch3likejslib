/*
   EventEmitterにより 33ms ごとに処理を起動する方式をテストする
    (1)Button01をクリック： 33ms ごとのループを開始する
    (2)Button02をクリック： emit通知で ループを抜ける
   狙い⇒ onceの定義をループごとに繰り返してemitがないときの挙動を確認する。

*/
import {PlayGround, Libs, Storage, Images, Sounds} from '../../../build/likeScratchLib.js'
import {sleep} from './sleep.js'
const Exec = class extends Libs.EventEmitter {

    constructor(){
        super();
        this.waitRelease = false;
    }

    async wait() {
        const self = this;
        return new Promise(async resolve=>{
            const _f = _=>{
                resolve(true);
            }
            self.once('STOP', _f);
            await sleep(33);
            self.removeListener("STOP",_f);
            resolve(false);
        });
    }

    async while(condition, f ){

        while(true){

            await f();

            const r = await this.wait();
            if(r === true) break;
        }
        console.log("while exited!!!!!!!!!!!!");
    }
}
const exec = new Exec();
let time = 0;
const button01 = document.getElementById('button01');
const button02 = document.getElementById('button02');
console.log("START")
button01.addEventListener('click', async (e)=>{
    console.log("Exec while start")
    await exec.while(_=>true, async function(){
        time += 1;
        //console.log(`time=${time}`);
    });
    console.log(' while exit count = '+time)

});
button02.addEventListener('click', async (e)=>{

    exec.emit("STOP");
    console.log("EMIT STOP");
});


