import {sleep} from './sleep.js'
import {Exec} from './exec.js'
const exec = new Exec();

let xx = 2;
//【2】 xx < 5 の間 ループする
await exec.whileAndWait( _=> xx<5 , async _=>{
    xx+=1;
    console.log(`【2】while ===== xx=${xx}`);
    let xy = 0;
    await exec.whileAndWait(_=> xy<3  , async _=>{
        xy += 1;
        console.log(`【2】while child ===== xx=${xx}, xy=${xy}`);
    });
    console.log('******* countup xx')
});

console.log('started!!!!')

await sleep(5000);

console.log('after 5000ms')
exec.stop();




