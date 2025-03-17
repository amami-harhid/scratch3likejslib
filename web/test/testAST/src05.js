const test = function() {return true}
const testArr = ["","",""];
module.exports =  function* testFunc() {
  let y = 0;
  while(true) {
    y+=1;
    if(y == 5) break;
    //yield;
  }
  y = 0;
  while(true){
    y+=1;
    if(y==4) break;
    //yield; // <--- 検知する
  }
}
module.exports  = test;
