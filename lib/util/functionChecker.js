/**
 * Functionの種類を判定する
 * 新しめのJavascript構文を扱える@babel/parserを使用する
 */
const { parse } = require("@babel/parser");

class FunctionChecker {
    /**
     * 関数定義を渡しアロー関数、Async、Generatorの種類を返す。
     * @param {CallableFunction} func 
     * @returns {FUNCTION_DECLARE} 関数の種類
     */
    static getFunctionDeclares(func) {

        const ast = parse(`const x = ${func.toString()}`);
        // @ts-ignore (ts(2339) declarations undefined error)
        const functionInit = ast.program.body[0].declarations[0].init;
        const isArrow = functionInit.type == "ArrowFunctionExpression";
        const isGenerator = functionInit.generator;
        const isAsync = functionInit.async;    
        return {
            isArrow: isArrow,
            isAsync: isAsync,
            isGenerator: isGenerator,
        }
    }
    /**
     * 未使用
     * @param {CallableFunction} func 
     * @returns {TYPE_OF_GENERATOR}
     */
    static getTypeOfGenerator(func) {
        let isAsyncGenerator = false;
        let isAwaiter = false;
        const ast = parse(`const x = ${func.toString()}`);
        // @ts-ignore (ts(2339) declarations undefined error)
        const functionInit = ast.program.body[0].declarations[0].init;
        if(functionInit.body && functionInit.body.body){
            if(Array.isArray(functionInit.body.body)){
                const body = functionInit.body.body[0];
                if(body.argument && body.argument.callee) {
                    const name = body.argument.callee.name;
                    if(name == "__asyncGenerator"){
                        isAsyncGenerator = true;
                    }
                    if(name == "__awaiter"){
                        isAwaiter = true;
                    }
                }
            }
        }
        return {
            isAsyncGenerator: isAsyncGenerator,
            isAwaiter: isAwaiter,
        };
    }
};
module.exports = FunctionChecker;