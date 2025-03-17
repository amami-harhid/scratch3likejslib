const test = function() {return true}
const testArr = ["","",""];
module.exports =  function* testFunc() {
  let y = 0;
  while(true) {
    for(let a=0; a< 10 ;a++){
      y += 1;
      yield; 
    }
    while(y<2){
      y+=1;
      yield
    }
    if(y == 5) break;
    yield;
  }
  testArr.forEach( function* (v){
    console.log(v);
    yield(2);
  })
  
  let x = 1;
  for(;;) {
    test();
    while(x<100){
      x+=1;
      yield;
    }
    if(x > 100) break;
    yield;
  }

  testArr.forEach( function* (v){
    console.log(v);
    yield(2);
  })

}
