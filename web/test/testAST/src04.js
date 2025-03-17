const test = function() {return true}
const testArr = ["","",""];
module.exports =  function* testFunc() {
  let y = 0;
  while(true) {
    y+=1;
    if(y == 5) break;
    while(true){
      if(y==4) break;
      yield;
    }
    yield;
  }
}
