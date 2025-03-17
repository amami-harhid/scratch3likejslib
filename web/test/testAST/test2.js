/**
 * test2
 * Esprima による Javascript構文パース
 * 
 * AST でパースしたあと、繰り返し構文を特定して、yeild があるかをチェックする
 * 
 */
const loopYieldCheck = require('./parse');
const testFunc = require('./src05');

// ----- 
// testFunc エラーにならないのはなぜ？
// 事象としては、while/for 構文があった後のチェックが素通りしている！

loopYieldCheck(testFunc);

