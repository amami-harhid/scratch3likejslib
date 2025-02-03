import {sleep} from './sleep.js'
import {Exec} from './exec.js'
const exec = new Exec();

window.KICK_TIMES = 1;


//【2】 xx < 5 の間 ループする
let xx = 0;
await exec.while( _=> xx<5 , async _=>{
    console.log(`【1】while ===== xx=${xx}`);
    let xy = 0;
    await exec.while(_=>xy<10  ,  async _=>{
        console.log(`【2】while ===== xx=${xx}, xy=${xy}`);
        let xz = 0;
        await exec.while(_=>xz<10, async _=>{
            console.log(`【3】while ===== xx=${xx}, xy=${xy}, xz=${xz}`);
            if( xx == 2 && xy == 2 && xz == 3) {
                console.log('=========break')
                Exec.break();
            }
            if( xx == 1 && xy == 2 && xz == 2) {
                xz = 5;
                console.log('=========continue')
                Exec.continue();
            }
            xz += 1;
        });
        xy += 1;
    });
    xx+=1;
});

//console.log('started!!!!')

//await sleep(1000);
//console.log('after 1000ms')
exec.stop();
console.log('End of Test')




