/*
    requestAnimationFrame の実験
    FPS=30 とする。

*/
const FPS = 30;
const frameInterval = 1000/FPS;
console.log(`frameInterval=${frameInterval}`)
let frame = 0;
let prevTimer = 0;
let count = 0;
let lastTime = performance.now();
let ss = lastTime;
const animate = (time)=>{
    if(frame%2 > 0){
        //update
        count+=1;
    }
    if(frame>10){
        let totalTime = performance.now() - ss;
        console.log(`count=${count}, time=${totalTime}, unit=${totalTime/count}`)
        return;
    }
    frame += 1;
    requestAnimationFrame(animate);    
}

console.log('START')
window.requestAnimationFrame(animate);

