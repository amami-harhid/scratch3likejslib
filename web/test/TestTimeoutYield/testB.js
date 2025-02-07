/*
    精密なsetTimeout の実験
    time が 33ms
    繰り返していくと誤差が生じるが誤差の分だけ 次の間隔を調整する方式
    ほぼ FPS(30)=(1000/30)ms 間隔を実現できている。
    
    これで WHILE(yield)をテストしてみる。

*/
import {sleepRepeatTest} from './test3.js'

//await sleepRepeatTest(1);
//await sleepRepeatTest(2);
//await sleepRepeatTest(3);
//await sleepRepeatTest(4);
//await sleepRepeatTest(5);
//await sleepRepeatTest(10);
//await sleepRepeatTest(20);
//await sleepRepeatTest(30);
//await sleepRepeatTest(40);
//await sleepRepeatTest(50);
await sleepRepeatTest(100);
//await sleepRepeatTest(500);

