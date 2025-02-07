/*
    精密なsetTimeout の実験
    time が 33ms
    繰り返していくと誤差が生じるが誤差の分だけ 次の間隔を調整する方式
    ほぼ FPS(30)=(1000/30)ms 間隔を実現できている。 

*/
const interval = 33.3;//1000/30;

let x=0;
let count =0;

const ss = performance.now();
let expected = performance.now() + interval;
const step = ()=>{
    // 開始遅延した時間を計測
    let dt = performance.now() - expected;
    x+=1;
    count+=1;
    if( x < 500){
        expected += interval;
        // 開始遅延した分 次の開始間隔を短くする
        // 遅延がない場合（マイナス値）,開始間隔を長くする
        setTimeout(step, Math.max( 0, Math.abs(interval -dt)));    
    }else{
        const totalTime = performance.now() - ss; 
        console.log(`TotalTime=${totalTime}, count=${count}, unitTime=${totalTime/count}`)
    }
}



step();
