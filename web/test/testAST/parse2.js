const esprima = require('esprima');

const parse = function( blockStatement , loop = false) {

  if( blockStatement.body) {
    if(Array.isArray(blockStatement.body)){
      let yieldLineNumber = 0;
      let lineNumber = 0;
      for(const statementBlock of blockStatement.body) {
        lineNumber += 1;
        if(statementBlock.type == "IfStatement") {
          const consequent = statementBlock.consequent;
          parse(consequent);
        }else if(statementBlock.type == "WhileStatement"){
          parse(statementBlock.body , true);

        }else if(statementBlock.type == "ForStatement"){
          parse(statementBlock.body, true);

        }else if(statementBlock.type == "ExpressionStatement"){
          const expression = statementBlock.expression;
          if( expression.type == "CallExpression"){
            if(expression.callee){
              if(expression.callee.type = "MemberExpression"){
                if(expression.callee.property.name == "forEach"){
                  const _arguments = expression.arguments;
                  if(Array.isArray(_arguments) && _arguments.length>0){
                    parse(_arguments[0].body, true);
                  }
                }
              }
            }
          }else if(expression.type == "YieldExpression"){
            // yield ステートメント
            yieldLineNumber = lineNumber;
          }
        }else{
          // その他は対象外

        }
      }
      // blockStatement.bodyの検索を終わらせた後
      if(loop && blockStatement.body.length != yieldLineNumber){
        throw "最終行に yieldがないです"
      }
    }
  }
}

module.exports =  function loopYieldCheck( func ) {
  const _src = func.toString();
  //console.log(_src);
  const src = "const _$_$_x = " + _src;
  //console.log(src);
  try{
    const ast = esprima.parseScript(src);
//    console.log("--------------")
//    console.log(ast);
    const script = ast.body[0]
//    console.log("--------------")
//    console.log(script);
    const declarations = script.declarations;
//    console.log("--------------declarations")
//    console.log(declarations);
    const blockStatements = declarations[0].init.body;
    // console.log("--------------blockStatements")
    // console.log(blockStatements);
    // console.log("--------------")
    parse(blockStatements);

  }catch(e){
    console.log(e);
    throw e;
  }
}

