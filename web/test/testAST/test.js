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
      body: [BlockStatement],  //---> 
      generator: true,
      expression: false,
      async: false
    }
  }
]
*/
console.log(ast.body[0].declarations[0].init.body); // ---> BlockStatement
/* 
BlockStatement {
  type: 'BlockStatement',
  body: [
    VariableDeclaration {     // ---> const arr = ["1","2","3"];
      type: 'VariableDeclaration',
      declarations: [Array],
      kind: 'const'
    },
    VariableDeclaration {     // ---> let a = 0;
      type: 'VariableDeclaration',
      declarations: [Array],
      kind: 'let'
    },
    IfStatement {             // ---> if( a == 2){
      type: 'IfStatement',
      test: [BinaryExpression],
      consequent: [BlockStatement],
      alternate: null
    }
  ]
}
*/

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
    },
    VariableDeclaration {            // let a = 0
      type: 'VariableDeclaration',
      declarations: [Array],
      kind: 'let'
    },
    DoWhileStatement {               // do { body } while( test )
      type: 'DoWhileStatement',
      body: [BlockStatement],
      test: [BinaryExpression]
    }
  ]
}

*/

console.log(ast.body[0].declarations[0].init.body.body[2].consequent.body[3]);
/* 
ExpressionStatement {
  type: 'ExpressionStatement',
  expression: CallExpression {
    type: 'CallExpression',
    callee: StaticMemberExpression {
      type: 'MemberExpression',
      computed: false,
      object: [Identifier],
      property: [Identifier]
    },
    arguments: [ [FunctionExpression] ]
  }
}
*/
const body = ast.body[0].declarations[0].init.body.body[2].consequent.body[3];
const expression = body.expression;
const collee = expression.callee;
console.log(collee);

/* collee
StaticMemberExpression {
  type: 'MemberExpression',
  computed: false,
  object: Identifier { type: 'Identifier', name: 'arr' },
  property: Identifier { type: 'Identifier', name: 'forEach' }
}
*/
const _arguments = expression.arguments;
console.log(_arguments);
/* [FunctionExpression] forEach の引数は１個だけ。
[
  FunctionExpression {
    type: 'FunctionExpression',
    id: null,
    params: [ [Identifier] ],
    body: BlockStatement { type: 'BlockStatement', body: [Array] },
    generator: true,
    expression: false,
    async: false
  }
]
*/
const functionExpresson = _arguments[0];
const functionExpressonBody = functionExpresson.body;
console.log(functionExpressonBody);
/* 
BlockStatement {
  type: 'BlockStatement',
  body: [
    ExpressionStatement {
      type: 'ExpressionStatement',
      expression: [CallExpression]   // ---> console.log(v);
    },
    ExpressionStatement {
      type: 'ExpressionStatement',
      expression: [YieldExpression]  // ---> yield(2)
    },
    ExpressionStatement {
      type: 'ExpressionStatement',
      expression: [YieldExpression]  // ---> yield
    }
  ]
}
*/
console.log(functionExpressonBody.body[1]);
/* 
ExpressionStatement {
  type: 'ExpressionStatement',
  expression: YieldExpression {
    type: 'YieldExpression',
    argument: Literal { type: 'Literal', value: 2, raw: '2' }, // --> yield(2)
    delegate: false
  }
}
*/
console.log(functionExpressonBody.body[2]);
/* 
ExpressionStatement {
  type: 'ExpressionStatement',
  expression: YieldExpression {
    type: 'YieldExpression',
    argument: null,   // ---> yield の() がない
    delegate: false
  }
}
*/

const body3 = ast.body[0].declarations[0].init.body.body[2].consequent.body[9]
console.log(body3);
/*  const mapArray = s.map((v) => v * 2);
VariableDeclaration {
  type: 'VariableDeclaration',
  declarations: [
    VariableDeclarator {
      type: 'VariableDeclarator',
      id: [Identifier],
      init: [CallExpression]
    }
  ],
  kind: 'const'
}

*/
const mapInit = body3.declarations[0].init;
console.log(mapInit);
/*  s.map((v) => v * 2)
CallExpression {
  type: 'CallExpression',
  callee: StaticMemberExpression {
    type: 'MemberExpression',
    computed: false,
    object: Identifier { type: 'Identifier', name: 's' },
    property: Identifier { type: 'Identifier', name: 'map' }
  },
  arguments: [
    ArrowFunctionExpression {
      type: 'ArrowFunctionExpression',
      id: null,
      params: [Array],
      body: [BinaryExpression],
      generator: false,
      expression: true,
      async: false
    }
  ]
}
*/
const mapInitArgumentsBody = mapInit.arguments[0].body;
console.log(mapInitArgumentsBody)