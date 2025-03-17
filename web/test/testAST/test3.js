/**
<<<<<<< HEAD
 * Ref
 * https://numb86-tech.hatenablog.com/entry/2020/09/11/104131
 * 
 * ここで必要なライブラリ
 * npm install --save esprima
 */
/**
 * Esprima による Javascript構文パース
 */
const esprima = require('esprima');


const testFunc = require('./src05');
console.log(`${testFunc}`)

const ast = esprima.parseScript(`const x=${testFunc}`);

console.log(ast);
=======
 * test2
 * Esprima による Javascript構文パース
 * 
 * AST でパースしたあと、繰り返し構文を特定して、yeild があるかをチェックする
 * 
 */
const loopYieldCheck = require('./parse');
const testFunc = require('./src05');

loopYieldCheck(testFunc);

>>>>>>> 945eedbf2f6615d04ff209acc3e22087ad9c61c7
