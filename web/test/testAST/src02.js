const test = function() {return true}
const testArr = ["","",""];
module.exports =  function* testFunc() {
  let y = 0;
  for(;;) {
    y+=1;
    if(y == 5) break;
    yield;
  }
}
