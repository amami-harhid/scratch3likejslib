import {Clock} from './clock.js'
/*
  function* の中から 別のfunction* を呼び出して yieldを活用できる
*/
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clock = new Clock();
async function main(){
    for(;;){
        clock.kick2();
        //if(allDone) break;
        await sleep(1000/30); // 1秒
    }    
    //console.log('OWARI')
}
main();
console.log('------ after main ---------');
/*
下の呼び方はエラーになる。Uncaught ReferenceError: yield is not defined
yieldはジェネレータ関数の中でのみ有効になるらしい。
console.log('Another yield Start')
yield* test2()
*/

/*
 次の挑戦は
 for文、while文の {  }内を RubyでいうところのBlock風に関数に渡す方法を探る
 Ruby風の Block渡しはJavascript文法上できないので、簡単にかけるアロー関数にしないといけなそう。
 例)  Loop( _=>{   } )
    _=> を付けるのが面倒だがしょうがない。
*/

class Exec {
    async loopStop() {
        this._stopper = false;
        await sleep(2000);
        this._stopper = true;
    }
    async while( condition, f ) {
        this._stopper = false;
        while(true) {
            if(this._stopper || !condition()){
                break;
            }
            f();
            await sleep(1000/30);
        }
        console.log('while in Exec , stop')
    }
}
const execTest = async _=>{
    console.log('---- exec test ');
    const exec = new Exec();
    console.log('---- exec loopStop go ');
    exec.loopStop();
    console.log('---- exec loopStop end ');
    let x = 0;
    console.log('---- exec while start ');
    const condition = _=> {return x<5;}
    await exec.while(condition, _=>{
        x+=1;
        console.log(`ブロックの中、x=${x}`);
    })
    console.log('======= exec while end ========');
    
}
execTest();

/*
  イベント登録処理で渡すブロック
  処理側の関数内で、ジェネレータ関数? --> これはかけません。

*/
const exec = new Exec();
const doc = window.document;

doc.listen = function( eventName, generator ){
    doc.addEventListener(eventName, function(){
        // event発生時にジェネレータを生成すると、何度でも実行される
        clock.register(generator);
    });
}
let count = 0;
doc.listen('click', 
    async function* (){
        const _count = ++count; // 関数内のローカル変数として固定化。
        for(let i=0;i<50;i++){
            console.log(`listen(${_count}) i=${i}`);
            await sleep(1000/30);
            yield (`listen(${_count}) i=${i}`)
        }
    }
);
console.log("=====after doc.listen===========")