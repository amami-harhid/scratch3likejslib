import {sleep} from './sleep.js'
class GenericPool {
    constructor() {
        this._g_pool = [];
        this._pool = [];
    }
    stop(){
        this.stopper = true;
    }
    async register( g ) {
        this._g_pool.push(g);
        this._pool.push({ready:true, done:false, f:g(), g:g});
        //console.log(this._pool);
    }
    async exec(g) {
        this.register(g);
        if(this._pool.length>0){
            // 最後に追加された要素を取得
            const _p = this._pool[this._pool.length-1];
            for(;;){
                // await で実行！
                const rslt = await _p.f.next();
                if(rslt.done){
                    // 最後の要素を除去
                    this._pool = this._pool.splice(0, this._pool.length-1);
                    break;
                }
                await sleep(1000/30);
            }
        }

    }
}
//const clock = await Clock.getInstance();
export  {GenericPool};