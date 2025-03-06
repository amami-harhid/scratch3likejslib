/**
 * test2
 * Esprima による Javascript構文パース
 * 
 * AST でパースしたあと、繰り返し構文を特定して、yeild があるかをチェックする
 * 
 * parse( element, loop = false)
 * const body = element.body;
 * if ( body is Array )
 *    body 要素を順番に ( _body )
 *      if loop == true
 *          const lastStatement = body[body.size()-1]
 *          if(lastStatement.type == "CallExpression")
 *            const caller = lastStatement.caller;
 *            if(caller.name != "yeild"){
 *                // NG
 *                例外を起こして中断する
 *            }
 *      if _body is WhileStatement or ForStatement
 *          const rtn = parse(_body);
 *      else if _body is ExpressionStatement
 *          
 *      else
 *          // チェック不要
 * 
 * else
 *    if element.type == WhileStatement, ForStatement
 *      const _body = element.body;
 *      if( _body is Array {
 *      
 *      }
 */
/**
 */
const esprima = require('esprima');

const parse = function( blockStatement , loop = false) {

  if( blockStatement.body) {
    if(Array.isArray(blockStatement.body)){
      let yieldLineNumber = 0;
      let lineNumber = 0;
      for(const statementBlock of blockStatement.body) {
        lineNumber += 1;
        if(statementBlock.type == "IfStatement") {
          // if構文の場合、yield 必須ではない
          const consequent = statementBlock.consequent;
          parse(consequent,false);
        }else if(statementBlock.type == "WhileStatement"){
          // while構文の場合、yield 必須
          parse(statementBlock.body , true);

        }else if(statementBlock.type == "ForStatement"){
          // for構文の場合、yield 必須
          parse(statementBlock.body, true);

        }else if(statementBlock.type == "DoWhileStatement"){
          // do...while 構文の場合、yield 必須
          parse(statementBlock.body, true);

        }else if(statementBlock.type == "ForInStatement") {
          // for...in 構文の場合、yield 必須ではない
          parse(statementBlock.body, false);
        
        }else if(statementBlock.type == "ForOfStatement"){
          // for...of 構文の場合、yield 必須ではない
          parse(statementBlock.body, false);

        }else if(statementBlock.type == "ExpressionStatement"){
          const expression = statementBlock.expression;
          if( expression.type == "CallExpression"){
            if(expression.callee){ // 念のため callee 存在チェック
              if(expression.callee.type = "MemberExpression"){
                // メソッド呼び出しの形式で、メソッドが forEachの場合
                if(expression.callee.property ){
                  const name = expression.callee.property.name;
                  if(name == "forEach" || 
                     name == "map" ||
                     name == "filter" ||
                     name == "reduce"
                    ){
                    const _arguments = expression.arguments;
                    if(Array.isArray(_arguments) && _arguments.length>0){
                      // forEach/map/filter/reduce の場合、yield必須ではない
                      parse(_arguments[0].body, false);
                    }
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
          // body を持たないはず。

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
  const src = "const _$00_$00_x00 = " + _src;
  try{
    const ast = esprima.parseScript(src);
    const script = ast.body[0]
    const declarations = script.declarations;
    const blockStatements = declarations[0].init.body;
    parse(blockStatements);

  }catch(e){
    console.log(e);
    //throw e;
  }
}
