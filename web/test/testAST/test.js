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

const src = `
    while(true) {
        const x = 1;
        let y = x + 2;
        yeild(y);
    }
`;

const esprima = require('esprima');

const ast = esprima.parseScript(src);

console.log(ast);
console.log(ast.body[0]);
console.log(ast.body[0].body.body[0]);
console.log(ast.body[0].body.body[1]);
console.log(ast.body[0].body.body[2]);
/*
node ./test.js
Script {
  type: 'Program',
  body: [
    WhileStatement {
      type: 'WhileStatement',
      test: [Literal],
      body: [BlockStatement]
    }
  ],
  sourceType: 'script'
}
WhileStatement {
  type: 'WhileStatement',
  test: Literal { type: 'Literal', value: true, raw: 'true' },
  body: BlockStatement {
    type: 'BlockStatement',
    body: [
      [VariableDeclaration],
      [VariableDeclaration],
      [ExpressionStatement]
    ]
  }
}
VariableDeclaration {
  type: 'VariableDeclaration',
  declarations: [
    VariableDeclarator {
      type: 'VariableDeclarator',
      id: [Identifier],
      init: [Literal]
    }
  ],
  kind: 'const'
}
VariableDeclaration {
  type: 'VariableDeclaration',
  declarations: [
    VariableDeclarator {
      type: 'VariableDeclarator',
      id: [Identifier],
      init: [BinaryExpression]
    }
  ],
  kind: 'let'
}
ExpressionStatement {
  type: 'ExpressionStatement',
  expression: CallExpression {
    type: 'CallExpression',
    callee: Identifier { type: 'Identifier', name: 'yeild' },
    arguments: [ [Identifier] ]
  }
}


*/

