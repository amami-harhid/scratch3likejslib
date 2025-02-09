import {Hats} from '../Hats.js';
import {Loop} from '../Controls.js';
const setting = _=> {

    // 最後のパラメータ("HAT","01","02")はデバッグ用なので後で消すこと
    Hats.whenFlag(async _=>{
        console.log('Flag CLICK!!');
        const s = performance.now();
        let count = 0;
        let x=0;
        await Loop.while(_=>x<5, async _=>{
//            console.log(`Flag click x=${x}`);
            let y=0;
            await Loop.while(_=>y<10, async _=>{
//                console.log(`Flag click x=${x},y=${y}`);
                y+=1;
                count+=1;
                /**
                 * break を入れると 1回あたりの時間が多少長くなる ( 33ms -> 35 ms 程度)
                 * 許容範囲とする
                 */
                //if(y>5) Loop.continue();
                //if(y>5) Loop.break();
            },"02");
            x+=1;
            count+=1;
            //if(x>5) Loop.break();
        },"01");
        console.log("---END---");
        const time = performance.now()-s;
        console.log(`time=${time}, count=${count}, loop=${time/count}`)
        console.log('END OF whenFlag');
    },"HAT");

    Hats.whenWindow(async _=>{
        console.log('Document CLICK!!');
        let x=0;
        await Loop.while(_=>x<100, async _=>{
            console.log(`Document click x=${x}`);
            x+=1;
        });
        console.log('END OF whenWindow');
    });
}

export {setting};