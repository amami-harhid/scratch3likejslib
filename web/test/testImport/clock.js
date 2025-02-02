export class Clock  {

    constructor() {
        this._pool = [];
        this._pool2 = [];
    }
    register( f ) {
        this._pool.push({ready:true, done:false, f:f(), of: f});
        this._pool2.push({ready:true, done:false, f:f(), of: f}); // of は要らないかも。
    }
    async kick() {
        let allDone = true;
        for(const _p of this._pool) {
            if(_p.done === false){
                const status = _p.f.next();
                console.log(status);
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
    async kick2() {
        let allDone = true;
        for(const _p of this._pool) {
            if(_p.done === false){
                let status;
                if(/^async\s/.test(_p.of.toString())){
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

