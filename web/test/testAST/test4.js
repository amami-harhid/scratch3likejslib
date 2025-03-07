/**
 * Ref @Babel/parserによるパース実験
 * 
 * ここで必要なライブラリ
 * npm install --save @babel/parser
 */
const {test01,test02,test03,test04,test05,test06,test07} = require('./src06');

const { parse } = require("@babel/parser");

const arr = [test01,test02,test03,test04,test05,test06,test07]

let testNo = 0;
for(const test of arr){
    testNo+=1;
    console.log(`【test0${testNo}】`);
    const ast = parse(`const x = ${test.toString()}`);
    const functionInit = ast.program.body[0].declarations[0].init;
    console.log("------------")
    if(functionInit.body.body.length>6){
        console.log(functionInit.body.body[6])
        console.log("------------")
        console.log(functionInit.body.body[6].body)

    }
    const arrowFunction = functionInit.type == "ArrowFunctionExpression";
    const generatorFunction = functionInit.generator;
    const asyncFunction = functionInit.async;
    console.log(`arrowFunction=${arrowFunction}, asyncFunction=${asyncFunction},generatorFunction=${generatorFunction}`);
}
