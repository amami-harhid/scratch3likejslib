const testArr = ["","",""];
const test =  async function*(){
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
    //yield; // <--- 検知しない
  }
}
module.exports  = test;
