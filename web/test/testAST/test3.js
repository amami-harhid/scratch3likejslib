/**
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
