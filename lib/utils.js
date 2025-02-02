const Utils = class {

    static isNumber( val ){
        if( val != undefined && typeof val === 'number' && isFinite(val)) {
            return true;
        }
        return false;
    }
    static isInteger( val ){
        if(Number.isInteger(val)){
            return true;
        }
        return false;
    }

    static _waitRapperRewrited(milliSecond = Utils.WAIT_TIME) {
        return Utils.wait(milliSecond);
    }

    static wait (milliSecond = Utils.WAIT_TIME) {
        return new Promise(resolve => setTimeout(resolve, milliSecond));
    }
    static waitUntil ( _condition, _pace, _bind ) {
        return new Promise( async (resolve) => {
            let condition;
            if( _bind ){
                condition = _condition.bind( _bind );
            }else{
                condition = _condition;
            }
    
            for(;;) {
                if( condition() === true ) {
                    break;
                }
                await Utils.wait( _pace /*Utils.WAIT_TIME*/ );
            }
            resolve();
        });
    }
    static get WAIT_TIME () {
        //return 5;
        return 0;
    }    

    static mapDeepCopy(src, dist, defaultValue) {
        let _dist;
        if( dist ) {
            _dist = dist;
        }else{
            _dist = new Map();
        }

        for(const k of src.keys()) {
            const v = src.get(k);
            if(defaultValue){
                _dist.set(v, defaultValue);

            }else{
                _dist.set(k, v);

            }
        }
        return _dist;
    }
    static generateUUID () {
        let d
        let r
    
        d = new Date().getTime()
    
        if (window.performance && typeof window.performance.now === 'function') {
            d += window.performance.now() // use high-precision timer if available
        }
    
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            r = (d + Math.random() * 16) % 16 | 0 // eslint-disable-line no-mixed-operators, no-bitwise
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) // eslint-disable-line no-mixed-operators, no-bitwise
        })
    
        return uuid;  
    }

}

module.exports = Utils;