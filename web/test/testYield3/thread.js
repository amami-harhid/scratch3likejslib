import {GenericPool} from './genericPool.js'
import {sleep} from './sleep.js'
export class Thread extends P.EventEmitter{
    static BREAK = "Error: break";
    static CONTINUE = "Error: continue";
    static break() {
        throw new Error('break');
    }
    static continue() {
        throw new Error('continue');
    }
    constructor(){
        super();
        this.gPool = new GenericPool();
        this.gPool.thread = this;
        this.visualFlag = false;
    }
    async stop() {
        this.gPool.stop();
    }
    async move(){
        this.visualFlag = true;
    }
    async while( condition, f ) {
        this.visualFlag = false;
        const _condition = (typeof condition == 'function')? condition: ()=>condition;
        let _total = 0;
        let count = 0;
        const self = this;
        const _arguments = arguments;
        const _g = async function* () {
            //const s = performance.now();
            while(_condition()){
                self.visualFlag = false;
                //const s = performance.now();
                try{
                    // ここは必ずawaitを入れること
                    await f();
                }catch(e){
                    if(e.toString() == Thread.BREAK){
                        break;
                    }else if(e.toString() == Thread.CONTINUE){
                        continue;
                    }else{
                        throw e;
                    }
                }
                if(self.visualFlag){
                    yield; // 描画に関係する処理があるとき yieldして停止する。
                }
                self.visualFlag = false;
                //count += 1;
                //_total = performance.now()-s;
                //console.log(`[${_arguments[2]}] time =${_total}, now=${performance.now()}`);
            }
            //throw new Error('LOOP_EXIT');
        }
        try{
            // EventEmitter の emit-->on のとき on内でthrowすると
            // emitした場所 で 例外が起こる。
            // よって、Thread内でイベントを受け取ることができない。
            const EmitId = "TEST";
            /*
            const self = this;
            this.on(EmitId, function(){
                console.log("on ===> "+ obj.emitId)
                console.log(this);
//                throw "LOOP_EXIT"; // ---> catchするのは、GenericPool#intervalの中
                self.emit("CATCH");
            });
            this.on("CATCH", _=>{
                throw "CATCH";// ---> catchするのは、GenericPool#intervalの中
            })
            */
            const obj = {f:_g(), g:_g, emitId:EmitId ,done:false};
            //const exitCondition = async _=>{
            //    return obj.done;
            //}
            this.gPool.register(obj);

            const s = performance.now();
            for(;;){
                if(obj.done) break;
                await sleep(0.1);
            }
/*
            //const _exitCounter = await this.gPool.wait(exitCondition, 0);
            console.log(`------ total=${_total}, count=${count}, average=${_total/count}`)
            const total = performance.now()-s;
            const dif = total - _total;
            console.log(`[${arguments[2]}] END time=${total}, dif=${dif}, difAverage=${dif/count}`)
*/    
        }catch(e){
            console.log("catch :: "+ e.toString());
            if(e.toString() == "LOOP_EXIT"){
                return;
            }
            throw new Error(e);
        }
    
    }



}