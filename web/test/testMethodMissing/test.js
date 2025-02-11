/*
  RubyみたいにmethodMissing時にエラーにせずに処理をさせる
*/

const target = { hoge: 'taget.hoge', bar: () => 'target.bar' };

class Base {
    sample01(p1,p2) {
        console.log(`Base ${p1}, ${p2}`);
    }

}
class Target extends Base{
}
const targetTest = new Target();

const proxy = new Proxy(targetTest, {
    get(target, name) {
      console.log(`get property ${name}`);
      if (name in target) {
        // オブジェクトに存在するプロパティーは値をそのまま返す
        console.log("Exist")
        return target[name];
      } else {
        throw `Method[${name}] does not exist.`
      }
    },
});
  
// targetに存在するプロパティーを呼び出した場合、temp_funcが返される
// temp_func()を関数として呼び出すと、proxyのapply()が呼び出されるので任意の処理を行うことができる
proxy.sample01(12, 'ab');
