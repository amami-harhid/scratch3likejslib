/**
 * test2
 * Esprima による Javascript構文パース
 * 
 * AST でパースしたあと、繰り返し構文を特定して、yeild があるかをチェックする
 * 
 */
const loopYieldCheck = require('./parse');
const testFunc = require('./src05');

loopYieldCheck(testFunc);

