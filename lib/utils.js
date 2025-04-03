const Utils = class {
    /**
     * 距離を計算する
     * @param {*} obj1 {x:number, y:number}
     * @param {*} obj2 {x:number, y:number}
     * @returns distance
     */
    static distance(obj1, obj2) {
        if(obj1 && obj2 && (obj1.x != undefined && obj1.y != undefined && obj2.x != undefined && obj2.y != undefined) ){
            const x1 = obj1.x;
            const y1 = obj1.y;
            const x2 = obj2.x;
            const y2 = obj2.y;
            if(Utils.isNumber(x1) && Utils.isNumber(y1) && Utils.isNumber(x2) && Utils.isNumber(y2)){
                const x = x1 - x2;
                const y = y1 - y2;
                const distanceSquare = x*x + y*y;
                const distance = Math.sqrt(distanceSquare);
                return distance;    
            }
        }
        return -1;
    }

    /**
     * min,max の範囲でランダム値を取得する
     * min,max 両方とも整数の場合、min,maxを含む整数のランダム値を返す
     * 上記以外の場合は minを含みmaxを含まない範囲で小数値のランダム値を返す。
     * min,max のどちらかが数値でない場合は 0 を返す
     * 
     * @param {Number} min 
     * @param {Number} max 
     * @param {Boolean} forceAsDecimal　True時には強制的に小数値として扱う。省略時はFalse。
     * @returns 
     */
    static randomizeInRange(min, max, forceAsDecimal=false){
        if( Utils.isNumber(min) && Utils.isNumber(max)) {
            if(forceAsDecimal===false && Utils.isInteger(min) && Utils.isInteger(max)){
                // 両方とも整数のとき
                const diff = max - min + 1;
                const randomValue = Math.random() * diff + min;
                return Math.floor(randomValue);
            }else{
                // 小数を含むとき（答えにMaxを含めない)
                if(min < max) {
                    const diff = max - min;
                    const randomValue = Math.random() * diff + min;
                    return randomValue;
                }
            }
        }
        return 0;
    }

    static isNumber( val ){
        if( val != undefined && (typeof val === 'number' || Utils.isInteger(val)) && isFinite(val)) {
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
/*
    static _waitRapperRewrited(milliSecond = Utils.WAIT_TIME) {
        return Utils.wait(milliSecond);
    }
*/
    static wait (milliSecond = 0) {
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
                await Utils.wait( _pace  );
            }
            resolve();
        });
    }
/*

    static get WAIT_TIME () {
        //return 5;
        return 0;
    }    
    */

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