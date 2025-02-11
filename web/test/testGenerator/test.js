/*
  function* の中から 別のfunction* を呼び出して yieldを活用できる
*/

class A {
    constructor(){
        this.aaa = null;
    }
    ppp() {
        console.log("ppp("+this.aaa+")");
    }
}

const a01 = new A();
a01.aaa = "TEST01";
const func01 = async function(obj) { 
    this.aaa = obj;
    this.ppp ();
}

const src = 'const _f = func; return async function*(){await _f(obj);}';
const f = new Function(['func','obj'], src);
const gen = f( func01.bind(a01), "aaaaaaa" );
const ff = gen();
ff.next();
