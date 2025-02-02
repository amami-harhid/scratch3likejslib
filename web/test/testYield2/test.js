import {sleep} from './sleep.js'
import {Exec} from './exec.js'
const exec = new Exec();
let x = 0;
//【1】 x < 50 の間 ループする
exec.while(_=> x<50 , _=>{
    console.log(`【1】while ----- x=${x}`);
    x+=1;
});

let xx = 0;
//【2】 xx < 5 の間 ループする
exec.while( _=> xx<1 , _=>{
    console.log(`【2】while ===== xx=${xx}`);
    let xy = 0;
    exec.while(_=> xy<12  , _=>{
        xy += 1;
        if(xy<5){
            Exec.continue();
        }else if(xy>10){
            Exec.break();
        }
        console.log(`【2】 reach bottom line...xy=${xy}`);
    });
    xx+=1;
});

// 【1】【2】は並列動作する。

console.log('started!!!!')

await sleep(5000);

console.log('after 5000ms')
exec.stop();




