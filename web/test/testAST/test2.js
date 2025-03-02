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

const blockStatementsCheck = function(statements){

  let checker = false;
  if(Array.isArray(statements)){
    if(statements.length>0){
      const lastStatement = statements[statements.length-1];
      // console.log("===last Statement")
      // console.log(lastStatement);
      if( lastStatement.type == "ExpressionStatement" 
        && lastStatement.expression 
      ){
        const expression = lastStatement.expression;
        const callee = expression.callee;
        if(callee && callee.name == "yield"){
          checker = true;
        }else{
          if(expression.name == "yield"){
            checker = true;
          }
        }
      } 
    }
  }
  if(checker === false){
    //throw "ループ処理の最後の行は yeild でないといけない"
    return false;
  }
  return true;

}
/**
 * 再帰処理、bodyを全て検索し、
 * 繰り返し処理があれば、『yeild』が最後のステートメントになければ
 * NGとする
 * @param {*} element 
 */
const parse = function(element) {
  // console.log("~~~~~~~~~~~~~~~~")
  // console.log(element)
  // console.log("~~~~~~~~~~~~~~~~")
  const KEY = ["WhileStatement", "ForStatement"]
  const ExpressionStatement = "ExpressionStatement";
  if(element.body) { 
    //console.log(' element.body found ')
    const body = element.body;
    console.log("(1) element.body")
    console.log(body)
    if(Array.isArray(body)){
      // console.log(' element.body is array ')
      // console.log("(2) loop is "+loop);
      console.log("body size = " + body.length)
      for(const _body of body){
        const _key = _body.type;
        if(KEY.includes(_key)){
            // ループ処理のとき
            //console.log(' Loop  ('+_key+")")
            // ForStatement 例： for(let x=0;x<10;x++){} のとき
            // ForStatement { } の testプロパティに x<10 の部分が入る
            // for(let x=0; ;x++){} のとき　testプロパティは null
            // null でなくて 条件設定されていても、条件次第で無限ループになりえるので
            // ForStatementの場合は yield を入れておくべきの結論とする。
            // 33ms で 1回だけ実行することになり「動作かなり遅い」可能性があるが
            // 安全性を考慮するとしょうがないとする。

            const blockStatement = _body.body;
            if(blockStatement){
              const statements = blockStatement.body;
              const ckecker = blockStatementsCheck(statements);
              if( ckecker === false) {
                //console.log("Error")
                const msg = ((_key=="WhileStatement")? "while":"for")
                    + "処理の最後の行には yeild を入れてください"
                throw msg
              }
            }
            return parse(_body);
        }else{
          console.log('---- Not Loop')
          console.log(_body.type);
          if(_body.type == ExpressionStatement && _body.expression){
            const expression = _body.expression;
            console.log('   -----expression')
            console.log(expression);
            if(expression.type == "CallExpression"){
              if(expression.callee){
                const callee = expression.callee;
                if(callee.type=="MemberExpression"){
                  const name = callee.property.name;
                  console.log('callee.property.name='+name)
                  if(name == "forEach"){
                    // 該当するメソッドのとき
//                    console.log(expression);
                    const arguments = expression.arguments;
                    if(Array.isArray(arguments)){
                      for(const funcExpression of arguments){
                        console.log('---- Expression arguments')
                        console.log(funcExpression);
                        if((funcExpression.type == "ArrowFunctionExpression" ||
                          funcExpression.type == "FunctionExpression") &&
                          funcExpression.body &&
                          funcExpression.body.body &&
                          Array.isArray(funcExpression.body.body)
                        ){
                          const statements = funcExpression.body.body;
                          const checker = blockStatementsCheck(statements);
                          if(checker === false){
                            const msg = "Array.forEach"
                              + "処理の最後の行には yeild を入れてください"
                            throw msg
                          }
                        }
                        // if(funcExpression.type == "FunctionExpression"){
                        //   const expBody = funcExpression.body;
                        //   if(expBody.body && Array.isArray(expBody.body)){
                        //     if(Array.isArray(expBody.body)){
                        //       const statements = expBody.body;
                        //       const checker = blockStatementsCheck(statements);
                        //       if(checker === false)
                        //         throw "Array.forEach の最後の行は yieldとしてください"
                        //     }
                        //   }
        
                        // }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }else{
      // console.log("element body is not array")
      console.log(body)    
      return parse(body);
    }
  }else{
    console.log("element has no body")
    console.log(element);

    return false;
  }

}

const loopYieldCheck = function( func ) {
  const _src = func.toString();
  const src = "const $$x = " + _src;
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

const test = function() {return true}
const testArr = ["","",""];
const testFunc = function() {
  for(let y=0;y<10;y++) {
    // for(let a=0; a< 10 ;a++){
       y += 1;
    //   yield; 
    // }
    if(y == 5) break;
    //yield;
  }
  
  let x = 1;
  for(;;) {
    test();
    while(x<100){
      x+=1;
      yield;
    }
    if(x > 100) break;
    yield;
  }
  testArr.forEach( function(v){
    console.log(v);
    yield(2);
  })
  const xx = 10;
  testArr.forEach( v => {
    console.log(v);
    //yield(2);
  })
  //console.log(xx);

}
const testFunc2 = function() {
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    yield(2);
  })
  testArr.forEach( (v)=>{
    console.log(v);
    //yield(2);
  })

}
// ----- 
// testFunc エラーにならないのはなぜ？

loopYieldCheck(testFunc);
