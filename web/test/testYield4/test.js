import {sleep} from './sleep.js'

window.KICK_TIMES = 1;

class Pool {
    constructor(){
        this.pool = [];
        this.stopper = false;
    }
    execStop(){
        this.stopper = true;
    }
    async regist(g){
        const f = g();
        this.pool.push(f);
        await this.exec();
    }
    removeLastOne(){
        if(this.pool.length>0){
//            console.log(`befor remove , register size =${this.pool.length}`)
            const _pool = [...this.pool];
            this.pool = _pool.splice(0,this.pool.length-1);
//            console.log(`after remove , register size =${this.pool.length}`)
        }
    }
    async exec() {
        for(;;){
            if(this.stopper) break;
            if(this.pool.length>0){
                const f = this.pool[this.pool.length-1];
                const rslt = await f.next();//<--- await 必要。
                // await つけないと while １回で終了する。
                // なぜなのかは追及していない。
                if(rslt.done){
                    this.removeLastOne();
                    break;
                }
            }
            await sleep(1000/30);
        }
    }
}
const pool = new Pool();

const Exec = class {

    async while(condition, f ){
        const args = arguments;
        const v = (args.length>2)? args[2]:_=>"";
        const g = async function* () {
            for(;;){
                //console.log(`【${v()}】 condition=${condition()}`)
                if(!condition()) break;
                await f();
                yield;
//                await sleep(33);
            }
        }
        await pool.regist(g);
    }
}

const exec = new Exec();
//pool.exec();

let x = 0;
await exec.while(_=>(x<10),  async (_)=>{

    console.log(`[1] x=${x}`);
    let y=0;
    //console.log('======before children while ('+x+')')
    // -----------------
    // exec.while()がすぐに終わるので
    // x+=1 が実行されていて(*2)では x=1 とカウントアップされている
    // (*1)が実行されたら whileが終わるまで(*3)を実行しないようにしたい。
    // pool.regist(g) の中で、g を使って while が終わるまで繰り返す
    // これを await することで、while終了まで次のステップに進まない（成功）。
    // -----------------
    // ↓ (*1)
    await exec.while(_=>y<3, async (_)=>{
        console.log(`[2] x=${x}, y=${y}`);//(*2)
        let z=0;
        await exec.while(_=>z<2, async _=>{
            console.log(`[3] x=${x}, y=${y}, z=${z}`);
            let zz = 0;
            await exec.while(_=>zz<10, _=>{
                console.log(`[4] x=${x}, y=${y}, z=${z}, zz=${zz}`);
                zz+=1;
            });
            z+=1;
        });
        y+=1;
    },_=>[x,y]);
    //console.log('======after children while ('+x+')')
    x+=1; // (*3)
},_=>"parent");

//await sleep(5*1000);
pool.execStop();
console.log('$$$$$$$$$$$$$$$')

/*
  子のwhile()が実行開始すると、親のwhile()の中の f.next()は停止されてほしい。

*/