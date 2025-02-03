/*
   未完成： アイデア破綻中
   ThreadsAll のなかで、POOLしたスレッドすべてを
   execしていくアイデアですが、execを並列動作させないと
   いけなそう。一斉に動かして 全部終わるのを監視するとよいのだろうか？
   よくアイデアを練る必要がある。

*/
import {Thread} from './thread.js'

const thread = new Thread();
//【2】 xx < 5 の間 ループする
let xx = 0;
await thread.while( _=> xx<5 , async _=>{
    console.log(`【1】while ===== xx=${xx}`);
    let xy = 0;
    await thread.while(_=>xy<10  ,  async _=>{
        console.log(`【2】while ===== xx=${xx}, xy=${xy}`);
        let xz = 0;
        await thread.while(_=>xz<10, async _=>{
            console.log(`【3】while ===== xx=${xx}, xy=${xy}, xz=${xz}`);
            if( xx == 2 && xy == 2 && xz == 3) {
                console.log('=========break')
                Thread.break();
            }
            if( xx == 1 && xy == 2 && xz == 2) {
                xz = 5;
                console.log('=========continue')
                Thread.continue();
            }
            xz += 1;
        });
        xy += 1;
    });
    xx+=1;
});

thread.stop();
console.log('End of Test')




