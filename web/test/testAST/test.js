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
const testFunc = require('./src00');
const ast = esprima.parseScript("const x= "+testFunc.toString());

console.log(ast);
/* 
Script {
  type: 'Program',
  body: [
    VariableDeclaration {
      type: 'VariableDeclaration',
      declarations: [Array],
      kind: 'const'
    }
  ],
  sourceType: 'script'
}

*/
console.log(ast.body);
/* 
[
  VariableDeclaration {
    type: 'VariableDeclaration',
    declarations: [ [VariableDeclarator] ],
    kind: 'const'
  }
]
*/
console.log(ast.body[0].declarations);
/*
[
  VariableDeclarator {
    type: 'VariableDeclarator',
    id: Identifier { type: 'Identifier', name: 'x' },
    init: FunctionExpression {
      type: 'FunctionExpression',
      id: [Identifier],
      params: [],
      body: [BlockStatement],
      generator: true,
      expression: false,
      async: false
    }
  }
]
*/
console.log(ast.body[0].declarations[0].init.body); // ---> BlockStatement
console.log(ast.body[0].declarations[0].init.body.body); // ---> BlockStatementの配列
/*
[
  VariableDeclaration {               // const arr = ["1","2","3"];
    type: 'VariableDeclaration',
    declarations: [ [VariableDeclarator] ],
    kind: 'const'
  },
  VariableDeclaration {               // let a = 0;
    type: 'VariableDeclaration',
    declarations: [ [VariableDeclarator] ],
    kind: 'let'
  },
  IfStatement {                       // if( a == 2){
    type: 'IfStatement',
    test: BinaryExpression {
      type: 'BinaryExpression',
      operator: '==',
      left: [Identifier],
      right: [Literal]
    },
    consequent: BlockStatement { type: 'BlockStatement', body: [Array] }, // if の { } の各行
    alternate: null
  }
]  
*/
// type="IfStatement" の場合、consequent があれば、それでパースをしなおす（再帰）。

console.log(ast.body[0].declarations[0].init.body.body[2].consequent); // ---> // if の { } の各行

/*
BlockStatement {
  type: 'BlockStatement',
  body: [
    VariableDeclaration {            // let y = 0;
      type: 'VariableDeclaration',
      declarations: [Array],
      kind: 'let'
    },
    WhileStatement {                 // while(true) {
      type: 'WhileStatement',
      test: [Literal],
      body: [BlockStatement]         // {  } の各行（配列）
    },
    ForStatement {                   // for(;;){
      type: 'ForStatement',
      init: null,
      test: null,
      update: null,
      body: [BlockStatement]         // {  } の各行（配列）
    },
    ExpressionStatement {            // arr.forEach( function* (v){
      type: 'ExpressionStatement',
      expression: [CallExpression]   // function* (v){
    }
  ]
}

*/