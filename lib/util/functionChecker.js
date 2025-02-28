class FunctionChecker {
    /**
     * アロー関数は prototypeを持たないことを利用して
     * アロー関数であるか否かを判定する。
     * async function() の場合も prototypeを持たないので、
     * 文字列化して 正規表現でチェックしている。
     * @param {*} f 
     * @returns True ( アロー関数 ), False ( 以外 )
     */
    static isArrowFunction( f ) {
        if( f ) {
            if(f.prototype == undefined) {
                // アロー関数または async function
                const str = f.toString();
                const isAsyncFunction = FunctionChecker.regexArrowFunction.test(str);
                if(isAsyncFunction) return false;
                return true;
            }        
        }
        // async でなく function　である(prototypeをもつ)、または f 自身が undefined
        return false;
    }
    static get regexArrowFunction() {
        return /^async\s+function\s*\([^\)]*\)\s*{/
    }
}
module.exports = FunctionChecker;