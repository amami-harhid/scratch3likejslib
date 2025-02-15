/*
  Function, アロー関数の判定
*/

const f01 = function(f02){
    console.log(this)
    return f02(this);
}

const f02 = ()=> {
    // + x の箇所がエラーが起きる. ソース上の行数がわからない！
    // Uncaught ReferenceError: x is not defined
    // at Test.eval (eval at exec (test.js:30:19), <anonymous>:7:30)
    const y = this.a + this.b + x;
    return y;
}

const f03 = (s)=> {
    console.log(s);
    return s.a + s.b;
}


class Test {
    constructor() {
        this.a = 10;
        this.b = 20;
    }
    exec( _f){
        const [argsSrc, bodySrc] = f02.toString().split("=>");
        const args = argsSrc.replace(/^ *\(/, "").replace(/\) *$/, "").split(",");
        const body = bodySrc.replace(/^ *\{/, "").replace(/\} *$/, "");
        const f = new Function(...args, body);
        try{
            return f.bind(this)();
    
        }catch(error){
            const stackLines = error.stack.split('\n');
            console.log(stackLines)
            const errorMsg = stackLines[0];
            const callerLine = stackLines[1];
            const lineNumbers = callerLine.match(/:(\d+):\d+\)$/)
            const lineNumber = lineNumbers[1];
            console.log(lineNumber);
            const lines = f.toString().replaceAll('\r',"").split('\n');
            const line = lines[lineNumber-1];
            lines[lineNumber-1] = line + "  **** <=== ERROR *** "
            let count = 0;
            for(let i=0; i<lines.length;i++){
                const line = lines[i];
                count += 1;
                const _count = `${count}`
                const _line = line;
                lines[i] = `${_count.padStart(5,"0")}: ${_line}`;
            }
            const linesN = [errorMsg,"", ...lines]
            console.log(linesN);
            return lineNumber;   
        }
    }
    exec2( _f1, _f2) {
        return _f1(_f2);
    }
}
const test = new Test();
console.log( test.exec(f02) );    
