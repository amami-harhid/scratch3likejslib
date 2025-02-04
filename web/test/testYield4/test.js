/*
   ThreadsAll のなかで、POOLしたスレッドすべてを
   YIELD していく方式
   (1) 変数スコープがJavascriptの規則通り。
   (2) イベント起動に対応する（並列化）
   (3) while構文風に記述、FPSにあわせSLEEPを自動で入れる。 

   TODO  Event定義にて Treadを作り出す手順が面倒そう。省略できないのかな？
   Tread.while() を見直すことでできるかもしれない。
   TODO  whileループのwait間隔は 1000/30 ms になっているかの計測必要。

*/
import {ThreadsAll} from './threadsAll.js';
import {Thread} from './thread.js';
import {sleep} from './sleep.js';

const threadsAll = ThreadsAll.getInstance();
// スレッド実行開始
threadsAll.startAll();

const button01 = document.getElementById('button01');
const button02 = document.getElementById('button02');
const button03 = document.getElementById('button03');
const buttonStop = document.getElementById('buttonStop');
buttonStop.addEventListener('click',()=>{
    // スレッド実行を全停止
    threadsAll.stopAll();
});
button01.addEventListener('click',async ()=>{
    // Event定義にて Treadを作り出す手順が面倒そう。省略できないのかな？
    const thread = new Thread();
    threadsAll.regist(thread);

    //【2】 xx < 5 の間 ループする
    let xx = 0;
    await thread.while( _=> xx<5 , async _=>{
        console.log(`【1】while === xx=${xx}`);
        let xy = 0;
        await thread.while(_=>xy<10  ,  async _=>{
            console.log(`【2】while ==== xx=${xx}, xy=${xy}`);
            xy += 1;
        });
        xx+=1;
    });
    thread.stop();
    console.log('End of Button01 Test')
});

button02.addEventListener('click', async()=>{
    const thread = new Thread();
    threadsAll.regist(thread);
    let xx = 0;
    await thread.while( _=> xx<5 , async _=>{
        console.log(`BUTTON02===【1】while ===== xx=${xx}`);
        let xy = 0;
        await thread.while(_=>xy<10  ,  async _=>{
            console.log(`BUTTON02====【2】while ===== xx=${xx}, xy=${xy}`);
            let xz = 0;
            await thread.while(_=>xz<10, async _=>{
                console.log(`BUTTON02=====【3】while ===== xx=${xx}, xy=${xy}, xz=${xz}`);
                if( xx == 2 && xy == 2 && xz == 3) {
                    console.log('BUTTON02=========break')
                    Thread.break();
                }
                if( xx == 1 && xy == 2 && xz == 2) {
                    xz = 5;
                    console.log('BUTTON02=========continue')
                    Thread.continue();
                }
                xz += 1;
            });
            xy += 1;
        });
        xx+=1;
    });
    thread.stop();

    console.log('End of Button02 Test')
});
button03.addEventListener('click', async()=>{
    console.log('button03 start');
    const thread = new Thread();
    threadsAll.regist(thread);
    let x = 0;
    const TIMES = 10;
    const start = Date.now();
    await thread.while( _=>x<TIMES, async _=>{
        x+=1;
    });
    const end = Date.now();
    console.log(`TIME=${(end-start)/TIMES}`);
    console.log(thread.time());
    console.log('button03 end');
});



