import {sleep} from './sleep.js'
import {Exec} from './exec.js'
const exec = new Exec();
let x = 0;
//【1】 x < 50 の間 ループする
exec.while(_=> x<50 , _=>{
    x+=1;
    console.log(`【1】while ----- x=${x}`);
});

let xx = 0;
//【2】 xx < 5 の間 ループする
exec.while( _=> xx<5 , _=>{
    xx+=1;
    console.log(`【2】while ===== xx=${xx}`);
    let xy = 0;
    exec.while(true, _=>{
        xy += 1;
        if(xy>10){
            break; // JS構文的に Errorになる.どうしたものかな？
        }
    });
});

// 【1】【2】は並列動作する。

console.log('started!!!!')

await sleep(5000);

console.log('after 5000ms')
exec.stop();




