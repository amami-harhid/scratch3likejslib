/*
  アロー関数の判定
*/

class FunctionChecker {
    /**
     * アロー関数は prototypeを持たないことを利用して
     * アロー関数であるか否かを判定する。
     * @param {*} f 
     * @returns True ( アロー関数 ), False ( 以外 )
     */
    static isArrowFunction( f ) {
        if( f ) {
            if(f.prototype == undefined) {
                // アロー関数または async function
                const str = f.toString();
                console.log(str)
                const isAsyncFunction = FunctionChecker.regexArrowFunction.test(str);
                if(isAsyncFunction) return false;
                return true;
            }else{
                // async でない function
                return false;
            }        
        }
        return false;
    }
    static get regexArrowFunction() {
        return /^async\s+function\s*\([^\)]*\)\s*{/
    }
}

const f01 = async function() {
    
    return true;
}

const f02 = function() {
    
    return true;
}

const f03 = async () => {
    return true;
}

const f04 = () => {
    return true;
}

const f05 = function*(){
    return true;
}


console.log( "f01 is arrow ? = " + FunctionChecker.isArrowFunction( f01 ));
   
console.log( "f02 is arrow ? =" + FunctionChecker.isArrowFunction( f02 ));

console.log( "f03 is arrow ? =" + FunctionChecker.isArrowFunction( f03 ));

console.log( "f04 is arrow ? =" + FunctionChecker.isArrowFunction( f04 ));

console.log( "f05 is arrow ? =" + FunctionChecker.isArrowFunction( f04 ));
