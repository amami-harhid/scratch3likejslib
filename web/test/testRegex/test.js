/*
  無限ループになりそうな構文があるとき
  繰り返し文の最後に yeild があればＯＫ
  なければＮＧとする 正規表現をつくる。

　なお、Stage,Spriteを継承した別クラスを使う場合
    class ExSprite extends Lib.Sprite {
        move() {
            while(true){
                // 何か処理をかく
                this.moveStep(5);
                // yieldがない
            }         
        }
        async nya() {
            await this.playUntilDone();
        }
    }
    let sprite; 
    Pg.prepare = async function() {
        sprite = new ExSprite("cat");
    }
    Pg.setup = async function() {  
        sprite.whenFlag( async function() { // <---function (a)
            while(true) {
                await this.nya();
            }
        });
        sprite.whenFlag( async function() { // <---function (b)
            this.move();
        });
    }

    Hat イベントのメソッドにて、「this」(ExSpriteインスタンス)のクラス
    を取得し、Spriteクラスではないときは
    (A) クラスを文字列化し、Yeild正規表現チェックをする
    (B) チェックＯＫの場合、その親クラスを取得し、(A)を繰り返す。Spriteに到達したら終了。
    (C) 次に 受け取るfunctionを文字列化し、Yeild正規表現をする。

*/
const TOP = class {

}
// 親クラス
const Parent = class extends TOP{
    update() {
        console.log("Parent#update");
    }
    moveStep() {
        console.log("Parent#moveStep");
    }
}

// 子クラス
const Child = class extends Parent {
    errorMethod() {
        while(true) {
            console.log("Infinity Loop");
        }
    }
    moveStep(){
        super.moveStep();        
    }
}

// 子子クラス
const ChildChild = class extends Child {

}

function getClass(classname){return Function('return (' + classname + ')')();}

function traceToParent(instance, stopClazz) {
    let proto = instance.__proto__;
    _traceToParent(proto, stopClazz);
}

function _traceToParent(instance, stopClazz) {
    const className = instance.constructor.name;
    if(className == stopClazz.name) return;
    const clazz = getClass(className);
    const src = clazz.toString();
    console.log(src);
    const whileCheck = infinityLoopChecker(src);
    console.log(whileCheck);

    let parent = instance.__proto__;
    _traceToParent(parent, stopClazz);
}

function infinityLoopChecker(src){
    const _src = src.replace(/\r?\n/g, '');
    // while文があるか
//    const regexWhile = /while\s*\([^\)]*\)\s*\{/
    const regexWhile = /while\s*\([^\)]*\)\s*\{/
    const check = regexWhile.test(_src);
    return check;

}

// クラスの文字列化
let ins = new ChildChild();
traceToParent(ins, Parent);

// while(true){
//     count += 1;
//     const className = proto.constructor.name;
//     if(className === "Parent") break;
//     console.log("("+count+") "+className); 
//     const clazz = getClass(className);
//     console.log("count("+(count)+") "+clazz.toString());
//     proto = proto.__proto__;
// }
