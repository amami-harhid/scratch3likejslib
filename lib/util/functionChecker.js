/**
 * Functionの種類を判定する
 * 新しめのJavascript構文を扱える@babel/parserを使用する
 */
const { parse } = require("@babel/parser");

class FunctionChecker {
    static getFunctionDeclares(func){

        const ast = parse(`const x = ${func.toString()}`);
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
}
module.exports = FunctionChecker;